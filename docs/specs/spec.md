# OpenSpec Specification - ai.cloudto.io 詳細規格

**基於：** design.md（已批准）
**日期：** 2025-10-25

---

## 規格摘要

**參考文件：**
- PRD: `docs/prd/ai.cloudto.io-PRD-v1.0.md`
- 設計系統: `docs/design/design-system.md`
- 技術設計: `docs/specs/design.md`
- 部署指南: `docs/devops/devops-guide.md`

**驗收標準：**
- ✅ 所有功能按 PRD 實作
- ✅ 測試覆蓋率 ≥ 80%
- ✅ 通過 E2E 測試
- ✅ 成功部署到 Dev 環境（dev-ai.cloudto.io）

---

## 核心規格

### 1. 圖片去背功能
- 支援格式：JPG, PNG, WebP
- 最大尺寸：2048x2048px
- 處理時間：桌面 2-5 秒，移動 8-15 秒
- 模型：U²Net Lite (4.7 MB)
- 執行環境：客戶端 WebGL

### 2. 多語系功能
- 支援語言：zh-tw, en, zh-cn, ja
- 預設語言：zh-tw
- URL 結構：/, /en, /zh-cn, /ja

### 3. 後端 API
- GET /health
- GET /api/version

詳細規格請參考相關文件。
