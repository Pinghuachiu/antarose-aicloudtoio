# CTO 技術指引總結 - ONNX 去背功能緊急啟用

**文件類型**：CTO 技術領導報告
**日期**：2025-10-25
**狀態**：🔴 緊急任務 - 等待執行

---

## 📊 問題分析

### 當前狀況
- **問題**：`frontend/components/features/upload-section.tsx` 所有 ONNX 代碼被完全註解（第 6-96 行）
- **影響**：圖片去背功能無法運作，用戶上傳後僅顯示原圖
- **根本原因**：開發過程中因缺少 ONNX 模型檔案，將所有 AI 處理邏輯暫時註解

### 技術債務評估
- **嚴重程度**：🔴 P0（核心功能完全無法使用）
- **影響範圍**：前端圖片處理主流程
- **修復時間**：約 1-2 小時（下載模型 + 代碼修改 + 測試）

---

## 🎯 解決方案

### CTO 已完成的工作

作為 CTO，根據 **CLAUDE.md 規範**，我不得直接執行前端開發任務，但已在權限範圍內提供以下技術支援：

#### 1️⃣ 建立詳細技術實施指引
**檔案位置**：
```
/Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/docs/specs/implementation-guide-onnx.md
```

**內容涵蓋**：
- ✅ U²Net ONNX 模型下載來源（已驗證可用）
- ✅ 代碼修改步驟（逐行指引）
- ✅ 測試驗證步驟
- ✅ 常見問題排查
- ✅ Git 提交指引

#### 2️⃣ 建立代碼修改明細文檔
**檔案位置**：
```
/Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/docs/specs/upload-section-code-changes.md
```

**內容涵蓋**：
- ✅ 需要修改的每一行代碼（修改前後對比）
- ✅ 詳細的代碼區塊說明
- ✅ TypeScript 類型檢查指引
- ✅ 驗收測試清單

#### 3️⃣ 建立自動化執行腳本
**檔案位置**：
```
/Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/scripts/enable-onnx-feature.sh
```

**功能**：
- ✅ 自動建立 `frontend/public/models/` 目錄
- ✅ 自動下載 U²Net Lite 模型（4.7 MB）
- ✅ 自動驗證模型完整性
- ✅ 自動備份原始檔案

#### 4️⃣ 驗證技術可行性
- ✅ 確認 ONNX Runtime 工具類別完整（`frontend/lib/ai/onnx-runtime.ts`）
- ✅ 確認 `onnxruntime-web` 依賴已安裝（`package.json` 第 23 行）
- ✅ 驗證 U²Net 模型下載連結有效（HTTP 302 重定向正常）
- ✅ 檢查專案結構與目錄配置正確

---

## 📋 執行計畫

### Waylon（前端開發工程師）執行步驟

#### Step 1: 執行自動化腳本
```bash
cd /Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio
./scripts/enable-onnx-feature.sh
```

**預期結果**：
- 自動下載模型至 `frontend/public/models/u2net.onnx`
- 自動備份原始檔案至 `upload-section.tsx.backup.*`

#### Step 2: 手動修改代碼
參考文檔：`docs/specs/upload-section-code-changes.md`

**需要修改的區塊**：
1. 第 6-14 行：取消註解 Import 語句
2. 第 21 行：取消註解 State 管理
3. 第 24-44 行：取消註解 initONNX 函數（並刪除第 41-43 行）
4. 第 62-92 行：取消註解 AI 處理流程
5. 第 94-96 行：**刪除**臨時原圖顯示代碼

#### Step 3: 測試驗證
```bash
cd frontend
npm run dev
```

**功能驗收清單**：
- [ ] 可上傳圖片（JPG, PNG, WebP）
- [ ] 顯示載入動畫
- [ ] 去背效果正確（背景透明，主體保留）
- [ ] 可下載 PNG 格式（透明背景）
- [ ] 可下載 JPG 格式（白色背景）
- [ ] 處理時間 < 5 秒（桌面）
- [ ] 無 Console 錯誤

#### Step 4: 提交代碼
```bash
git add frontend/components/features/upload-section.tsx
git add frontend/public/models/u2net.onnx
git commit -m "feat(ui): enable ONNX background removal functionality

- Uncomment all ONNX runtime code in upload-section.tsx
- Add U²Net Lite model (4.7 MB)
- Implement complete background removal pipeline
- Test on desktop and mobile devices

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🔍 後續驗證流程

### Lucia（QA 工程師）E2E 測試
Waylon 完成後，Lucia 需執行以下測試：

1. **功能測試**
   - 上傳各種格式圖片（JPG, PNG, WebP）
   - 驗證去背效果
   - 測試下載功能（PNG/JPG）

2. **性能測試**
   - 測試不同尺寸圖片的處理時間
   - 驗證是否符合規格（桌面 < 5 秒，移動 < 15 秒）

3. **跨瀏覽器測試**
   - Chrome（WebGL 2.0）
   - Firefox（WebGL 2.0）
   - Safari（WebGL 支援檢查）
   - Edge（WebGL 2.0）

4. **錯誤處理測試**
   - 超大圖片上傳
   - 不支援格式
   - 網路中斷情境

### CTO 最終驗收
所有測試通過後，CTO 需進行：

1. **代碼審查**
   - 確認所有 ONNX 代碼已正確啟用
   - 確認無臨時測試代碼殘留
   - 確認符合 TypeScript 規範

2. **規格驗收**
   - 對照 `docs/specs/spec.md` 確認功能完整
   - 確認符合 PRD 要求

3. **產出驗收報告**
   - 總結功能狀態
   - 記錄測試結果
   - 更新技術文檔

---

## ⚠️ 風險與注意事項

### 技術風險
1. **模型載入失敗**
   - 風險：GitHub Release Assets 連結失效
   - 緩解：提供替代下載來源（HuggingFace）

2. **瀏覽器相容性**
   - 風險：部分瀏覽器不支援 WebGL 2.0
   - 緩解：已實作 `checkWebGLSupport()` 檢查函數

3. **性能問題**
   - 風險：移動裝置處理時間過長
   - 緩解：使用輕量級模型（4.7 MB）而非完整版（176 MB）

### 流程風險
1. **無法委派 Waylon**
   - 當前系統未提供 Task tool
   - CTO 無法正式委派團隊成員
   - 需用戶手動執行或等待工具修復

### 建議
- ✅ 優先使用自動化腳本下載模型（減少人為錯誤）
- ✅ 使用提供的詳細文檔進行代碼修改（逐行對照）
- ✅ 完成後立即通知 Lucia 進行 E2E 測試
- ✅ 保留備份檔案，以便遇到問題時快速還原

---

## 📦 交付物清單

CTO 已產出以下技術文檔與工具：

| 檔案 | 類型 | 說明 |
|------|------|------|
| `docs/specs/implementation-guide-onnx.md` | 技術指引 | 完整實施步驟與驗收清單 |
| `docs/specs/upload-section-code-changes.md` | 代碼明細 | 逐行修改對比與驗證方式 |
| `scripts/enable-onnx-feature.sh` | 自動化腳本 | 模型下載與環境配置 |
| `docs/specs/cto-summary-onnx-activation.md` | 總結報告 | 本文件 |

---

## ✅ 驗收標準

Waylon 完成後，以下條件必須全部滿足：

### 功能驗收
- [ ] 可上傳並去背圖片（非顯示原圖）
- [ ] 可下載 PNG 格式（透明背景）
- [ ] 可下載 JPG 格式（白色背景）
- [ ] 處理時間符合規格要求

### 代碼品質驗收
- [ ] 所有 ONNX 代碼已取消註解
- [ ] 無臨時測試代碼殘留
- [ ] 通過 TypeScript 類型檢查（`npm run build`）
- [ ] 通過 ESLint 檢查（`npm run lint`）

### 文檔驗收
- [ ] Git commit message 符合 Conventional Commits 規範
- [ ] 代碼修改記錄在 commit message 中

### 測試驗收（Lucia 負責）
- [ ] E2E 測試通過
- [ ] 跨瀏覽器測試通過
- [ ] 性能測試通過

---

## 📞 聯絡方式

如遇到技術問題或需要 CTO 支援，請回報以下資訊：

1. 錯誤訊息截圖（瀏覽器 Console）
2. 執行步驟描述
3. 環境資訊（瀏覽器版本、OS）

CTO 將協助排查並提供解決方案。

---

**文件版本**：v1.0
**最後更新**：2025-10-25
**CTO 簽核**：✅ 已審核
