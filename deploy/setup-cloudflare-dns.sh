#!/bin/bash
# ========================================
# ai.cloudto.io - Cloudflare DNS 設定腳本
# 用途: 創建 DNS A 記錄並啟用 Cloudflare Proxy
# ========================================

set -e # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ai.cloudto.io - Cloudflare DNS 設定${NC}"
echo -e "${GREEN}========================================${NC}"

# ========================================
# 載入 Cloudflare Credentials
# ========================================
echo -e "\n${YELLOW}[1/4] 載入 Cloudflare Credentials...${NC}"

if [ ! -f "resources/resource.md" ]; then
    echo -e "${RED}錯誤: resources/resource.md 不存在${NC}"
    exit 1
fi

# 從 resource.md 讀取環境變數
export CF_ACCOUNT_ID=$(grep "^CF_ACCOUNT_ID=" resources/resource.md | cut -d'=' -f2)
export CF_API_TOKEN=$(grep "^CF_API_TOKEN=" resources/resource.md | cut -d'=' -f2)
export CLOUDFLARE_APIKEY=$(grep "^CLOUDFLARE_APIKEY=" resources/resource.md | cut -d'=' -f2)
export CLOUDFLARE_EMAIL=$(grep "^CLOUDFLARE_USE_MAIL=" resources/resource.md | cut -d'=' -f2)
export CF_ZONE_ID="9258e14c5e6b231e6d3499ee857ca993" # cloudto.io Zone ID

# 驗證環境變數
if [ -z "$CF_ACCOUNT_ID" ] || [ -z "$CLOUDFLARE_APIKEY" ] || [ -z "$CLOUDFLARE_EMAIL" ]; then
    echo -e "${RED}錯誤: Cloudflare credentials 不完整${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Cloudflare credentials 已載入${NC}"
echo -e "${BLUE}Account ID: $CF_ACCOUNT_ID${NC}"
echo -e "${BLUE}Email: $CLOUDFLARE_EMAIL${NC}"
echo -e "${BLUE}Zone ID: $CF_ZONE_ID${NC}"

# ========================================
# 創建 Development DNS 記錄
# ========================================
echo -e "\n${YELLOW}[2/4] 創建 Development DNS 記錄 (dev-ai.cloudto.io)...${NC}"

DEV_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records" \
  -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
  -H "X-Auth-Key: ${CLOUDFLARE_APIKEY}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "dev-ai",
    "content": "165.154.226.78",
    "ttl": 1,
    "proxied": true
  }')

# 檢查回應
if echo "$DEV_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Development DNS 記錄創建成功${NC}"
    DEV_RECORD_ID=$(echo "$DEV_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${BLUE}Record ID: $DEV_RECORD_ID${NC}"
    echo -e "${BLUE}Domain: dev-ai.cloudto.io${NC}"
    echo -e "${BLUE}IP: 165.154.226.78${NC}"
    echo -e "${BLUE}Proxied: true (橘色雲朵已啟用)${NC}"
elif echo "$DEV_RESPONSE" | grep -q '"code":81057'; then
    echo -e "${YELLOW}⚠ DNS 記錄已存在，跳過創建${NC}"
else
    echo -e "${RED}錯誤: DNS 記錄創建失敗${NC}"
    echo -e "${RED}回應: $DEV_RESPONSE${NC}"
    exit 1
fi

# ========================================
# 配置 Cloudflare SSL 設定
# ========================================
echo -e "\n${YELLOW}[3/4] 配置 Cloudflare SSL 設定...${NC}"

# 設定 SSL 模式為 Flexible
echo -e "${BLUE}設定 SSL 模式為 Flexible...${NC}"
SSL_RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/ssl" \
  -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
  -H "X-Auth-Key: ${CLOUDFLARE_APIKEY}" \
  -H "Content-Type: application/json" \
  --data '{"value":"flexible"}')

if echo "$SSL_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ SSL 模式已設定為 Flexible${NC}"
else
    echo -e "${YELLOW}⚠ SSL 模式設定可能失敗，請檢查 Cloudflare Dashboard${NC}"
fi

# 啟用 Always Use HTTPS
echo -e "${BLUE}啟用 Always Use HTTPS...${NC}"
HTTPS_RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/always_use_https" \
  -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
  -H "X-Auth-Key: ${CLOUDFLARE_APIKEY}" \
  -H "Content-Type: application/json" \
  --data '{"value":"on"}')

if echo "$HTTPS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Always Use HTTPS 已啟用${NC}"
else
    echo -e "${YELLOW}⚠ Always Use HTTPS 設定可能失敗，請檢查 Cloudflare Dashboard${NC}"
fi

# ========================================
# DNS 傳播檢查
# ========================================
echo -e "\n${YELLOW}[4/4] DNS 傳播檢查...${NC}"
echo -e "${BLUE}等待 DNS 傳播（約 1-5 分鐘）...${NC}"

for i in {1..5}; do
    echo -e "${BLUE}嘗試 $i/5...${NC}"

    # 檢查 DNS 解析
    DEV_IP=$(dig +short dev-ai.cloudto.io @1.1.1.1 | tail -n1)

    if [ ! -z "$DEV_IP" ]; then
        echo -e "${GREEN}✓ DNS 已傳播${NC}"
        echo -e "${BLUE}dev-ai.cloudto.io → $DEV_IP${NC}"
        break
    fi

    if [ $i -lt 5 ]; then
        echo -e "${YELLOW}等待 30 秒後重試...${NC}"
        sleep 30
    fi
done

if [ -z "$DEV_IP" ]; then
    echo -e "${YELLOW}⚠ DNS 尚未完全傳播，請稍後手動檢查${NC}"
fi

# ========================================
# 完成
# ========================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Cloudflare DNS 設定完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\n${BLUE}已創建的 DNS 記錄：${NC}"
echo -e "- ${YELLOW}dev-ai.cloudto.io${NC} → 165.154.226.78 (Proxied: ✓)"
echo -e "\n${BLUE}SSL/TLS 配置：${NC}"
echo -e "- SSL 模式: ${YELLOW}Flexible${NC}"
echo -e "- Always Use HTTPS: ${YELLOW}已啟用${NC}"
echo -e "\n${YELLOW}下一步：${NC}"
echo -e "1. 執行部署腳本: ${BLUE}./deploy/deploy-dev.sh${NC}"
echo -e "2. 等待 5 分鐘讓 DNS 完全傳播"
echo -e "3. 訪問 ${YELLOW}https://dev-ai.cloudto.io${NC} 驗證部署"
echo -e "\n${YELLOW}注意事項：${NC}"
echo -e "- 如需創建 Production DNS (ai.cloudto.io)，請修改此腳本並取消註解相關部分"
echo -e "- Production 部署需要 CTO 批准"
