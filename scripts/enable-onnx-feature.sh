#!/bin/bash
#
# ONNX 去背功能啟用腳本
# 用途：自動下載模型並取消註解相關代碼
# 執行者：Waylon（前端開發工程師）
# 日期：2025-10-25
#

set -e  # 遇到錯誤立即退出

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 專案根目錄
PROJECT_ROOT="/Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
PUBLIC_DIR="$FRONTEND_DIR/public"
MODELS_DIR="$PUBLIC_DIR/models"
UPLOAD_SECTION="$FRONTEND_DIR/components/features/upload-section.tsx"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}ONNX 去背功能啟用腳本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Step 1: 檢查目錄結構
echo -e "${YELLOW}[1/4] 檢查目錄結構...${NC}"
if [ ! -d "$FRONTEND_DIR" ]; then
  echo -e "${RED}錯誤：前端目錄不存在 $FRONTEND_DIR${NC}"
  exit 1
fi

# 建立 models 目錄
mkdir -p "$MODELS_DIR"
echo -e "${GREEN}✓ 目錄結構正常${NC}"
echo ""

# Step 2: 下載 U²Net 模型
echo -e "${YELLOW}[2/4] 下載 U²Net Lite 模型 (4.7 MB)...${NC}"
MODEL_PATH="$MODELS_DIR/u2net.onnx"

if [ -f "$MODEL_PATH" ]; then
  echo -e "${YELLOW}⚠ 模型檔案已存在，跳過下載${NC}"
  echo -e "   位置: $MODEL_PATH"
  ls -lh "$MODEL_PATH"
else
  echo -e "   下載中..."
  curl -L https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx \
    -o "$MODEL_PATH" \
    --progress-bar

  if [ -f "$MODEL_PATH" ]; then
    echo -e "${GREEN}✓ 模型下載成功${NC}"
    ls -lh "$MODEL_PATH"
  else
    echo -e "${RED}錯誤：模型下載失敗${NC}"
    exit 1
  fi
fi
echo ""

# Step 3: 備份原始檔案
echo -e "${YELLOW}[3/4] 備份原始檔案...${NC}"
if [ ! -f "$UPLOAD_SECTION" ]; then
  echo -e "${RED}錯誤：upload-section.tsx 不存在${NC}"
  exit 1
fi

BACKUP_FILE="$UPLOAD_SECTION.backup.$(date +%Y%m%d_%H%M%S)"
cp "$UPLOAD_SECTION" "$BACKUP_FILE"
echo -e "${GREEN}✓ 已備份至: $BACKUP_FILE${NC}"
echo ""

# Step 4: 提示手動取消註解
echo -e "${YELLOW}[4/4] 代碼修改指引${NC}"
echo -e "${RED}⚠️ 重要：以下步驟需要手動執行${NC}"
echo ""
echo -e "請開啟檔案進行編輯："
echo -e "  ${GREEN}$UPLOAD_SECTION${NC}"
echo ""
echo -e "需要取消註解的區塊："
echo -e "  1. 第 6-14 行：Import 語句"
echo -e "  2. 第 21 行：State 管理"
echo -e "  3. 第 24-44 行：initONNX 函數（並刪除第 41-43 行）"
echo -e "  4. 第 62-92 行：AI 處理流程（並刪除第 94-96 行）"
echo ""
echo -e "詳細指引請參考："
echo -e "  ${GREEN}$PROJECT_ROOT/docs/specs/implementation-guide-onnx.md${NC}"
echo ""

# Step 5: 驗證模型
echo -e "${YELLOW}驗證模型完整性...${NC}"
MODEL_SIZE=$(stat -f%z "$MODEL_PATH" 2>/dev/null || stat -c%s "$MODEL_PATH" 2>/dev/null)
EXPECTED_MIN_SIZE=$((4 * 1024 * 1024))  # 4 MB
EXPECTED_MAX_SIZE=$((6 * 1024 * 1024))  # 6 MB

if [ "$MODEL_SIZE" -lt "$EXPECTED_MIN_SIZE" ]; then
  echo -e "${RED}錯誤：模型檔案過小，可能下載不完整${NC}"
  echo -e "  當前大小: $(($MODEL_SIZE / 1024 / 1024)) MB"
  echo -e "  預期大小: 4-6 MB"
  exit 1
elif [ "$MODEL_SIZE" -gt "$EXPECTED_MAX_SIZE" ]; then
  echo -e "${YELLOW}⚠ 警告：模型檔案過大${NC}"
  echo -e "  當前大小: $(($MODEL_SIZE / 1024 / 1024)) MB"
  echo -e "  請確認是否下載了正確的模型（u2netp 而非 u2net）"
else
  echo -e "${GREEN}✓ 模型檔案大小正常: $(($MODEL_SIZE / 1024 / 1024)) MB${NC}"
fi
echo ""

# 最終提示
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}自動化步驟已完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "下一步："
echo -e "  1. 手動取消註解 upload-section.tsx 代碼"
echo -e "  2. 執行測試："
echo -e "     ${GREEN}cd $FRONTEND_DIR${NC}"
echo -e "     ${GREEN}npm run dev${NC}"
echo -e "  3. 開啟瀏覽器測試： ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "如遇問題，請參考實施指引文件。"
