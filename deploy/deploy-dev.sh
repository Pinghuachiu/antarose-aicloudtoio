#!/bin/bash
# ========================================
# ai.cloudto.io - Development 環境部署腳本
# Domain: dev-ai.cloudto.io
# Port: 3001
# ========================================

set -e # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置變數
SERVER_IP="165.154.226.78"
SERVER_USER="jackalchiu"
APP_DIR="/var/www/ai-cloudto-io-dev"
PM2_APP_NAME="ai-cloudto-io-dev"
NGINX_CONFIG="deploy/nginx/ai-cloudto-io-dev.conf"
PORT=3001

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ai.cloudto.io - Development 環境部署${NC}"
echo -e "${GREEN}========================================${NC}"

# 步驟 1: 檢查必要檔案
echo -e "\n${YELLOW}[1/8] 檢查必要檔案...${NC}"
if [ ! -f "ecosystem.config.js" ]; then
    echo -e "${RED}錯誤: ecosystem.config.js 不存在${NC}"
    exit 1
fi
if [ ! -f "$NGINX_CONFIG" ]; then
    echo -e "${RED}錯誤: $NGINX_CONFIG 不存在${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 必要檔案檢查完成${NC}"

# 步驟 2: SSH 連線測試
echo -e "\n${YELLOW}[2/8] 測試 SSH 連線...${NC}"
ssh -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" "echo 'SSH 連線成功'" || {
    echo -e "${RED}錯誤: 無法連線到伺服器 $SERVER_IP${NC}"
    exit 1
}
echo -e "${GREEN}✓ SSH 連線測試通過${NC}"

# 步驟 3: 創建應用目錄
echo -e "\n${YELLOW}[3/8] 創建應用目錄...${NC}"
ssh "$SERVER_USER@$SERVER_IP" << EOF
    sudo mkdir -p $APP_DIR
    sudo chown $SERVER_USER:$SERVER_USER $APP_DIR
    echo "✓ 目錄已創建: $APP_DIR"
EOF

# 步驟 4: 使用 Git 更新程式碼（版本控制）
echo -e "\n${YELLOW}[4/8] 使用 Git 更新程式碼...${NC}"
ssh "$SERVER_USER@$SERVER_IP" << EOF
    cd $APP_DIR

    # 如果是首次部署，先 clone
    if [ ! -d ".git" ]; then
        echo "首次部署，請先在 VPS 上執行: git clone <repository-url> $APP_DIR"
        exit 1
    fi

    # Pull 最新代碼
    echo "拉取最新代碼..."
    git pull origin develop || git pull origin master

    echo "✓ 代碼更新完成"
EOF
echo -e "${GREEN}✓ Git 更新完成${NC}"

# 步驟 5: 安裝依賴和構建
echo -e "\n${YELLOW}[5/8] 安裝依賴和構建應用...${NC}"
ssh "$SERVER_USER@$SERVER_IP" << EOF
    cd $APP_DIR
    echo "安裝 npm 依賴..."
    npm install --production=false
    echo "構建應用..."
    npm run build
    echo "✓ 構建完成"
EOF

# 步驟 6: 配置 Nginx（從 Git repository）
echo -e "\n${YELLOW}[6/8] 配置 Nginx...${NC}"
ssh "$SERVER_USER@$SERVER_IP" << EOF
    # Nginx 配置也從 Git repository 讀取
    cd $APP_DIR
    sudo cp deploy/nginx/ai-cloudto-io-dev.conf /etc/nginx/sites-available/ai-cloudto-io-dev.conf
    sudo ln -sf /etc/nginx/sites-available/ai-cloudto-io-dev.conf /etc/nginx/sites-enabled/
    echo "測試 Nginx 配置..."
    sudo nginx -t
    echo "重新載入 Nginx..."
    sudo systemctl reload nginx
    echo "✓ Nginx 配置完成"
EOF

# 步驟 7: 啟動 PM2
echo -e "\n${YELLOW}[7/8] 啟動 PM2 應用...${NC}"
ssh "$SERVER_USER@$SERVER_IP" << EOF
    cd $APP_DIR

    # 停止舊的進程（如果存在）
    pm2 stop $PM2_APP_NAME 2>/dev/null || true
    pm2 delete $PM2_APP_NAME 2>/dev/null || true

    # 啟動新進程
    pm2 start ecosystem.config.js --only $PM2_APP_NAME

    # 保存 PM2 配置
    pm2 save

    # 顯示狀態
    pm2 list

    echo "✓ PM2 應用已啟動"
EOF

# 步驟 8: 健康檢查
echo -e "\n${YELLOW}[8/8] 執行健康檢查...${NC}"
sleep 5 # 等待應用啟動
ssh "$SERVER_USER@$SERVER_IP" << EOF
    echo "檢查應用是否在監聽 port $PORT..."
    if netstat -tlnp 2>/dev/null | grep -q ":$PORT"; then
        echo "✓ 應用正在監聽 port $PORT"
    else
        echo "⚠ 警告: 應用可能未正確啟動"
    fi

    echo "測試 health endpoint..."
    curl -s http://localhost:$PORT/health || echo "⚠ health endpoint 無回應"
EOF

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Domain: ${YELLOW}https://dev-ai.cloudto.io${NC}"
echo -e "請等待 Cloudflare DNS 生效（約 1-5 分鐘）"
echo -e "\n查看日誌: ${YELLOW}ssh $SERVER_USER@$SERVER_IP 'pm2 logs $PM2_APP_NAME'${NC}"
echo -e "查看狀態: ${YELLOW}ssh $SERVER_USER@$SERVER_IP 'pm2 status'${NC}"
