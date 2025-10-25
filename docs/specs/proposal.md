# OpenSpec Proposal - ai.cloudto.io AI 去背小幫手

**提案編號：** AICLOUD-001
**提案日期：** 2025-10-25
**提案人：** CTO (Antarose AI Tech Inc.)
**專案類型：** 新專案開發
**優先級：** 高

---

## 一、變更提案概述

### 1.1 提案主題

開發 **ai.cloudto.io AI 去背小幫手** - 一款完全在客戶端執行的 AI 圖片去背工具網站。

### 1.2 提案背景

**市場需求：**
- 現有去背工具多需上傳圖片到伺服器，隱私風險高
- 繁體中文市場缺乏本地化的專業去背工具
- 使用者期望快速、免費、無需註冊的解決方案

**商業機會：**
- 透過 Google AdSense 和贊助實現變現
- 目標用戶：台灣、香港、澳門的設計師、電商賣家、一般使用者
- 可擴展為付費進階功能

### 1.3 提案目標

**核心目標：**
1. 開發純客戶端 AI 去背工具（WebGL 加速）
2. 支援多語系（繁中、簡中、英文、日文）
3. 部署到 VPS，使用 Cloudflare 作為 CDN + Proxy
4. 保留後端擴展能力（帳號系統、付費功能等）

**成功指標：**
- 桌面處理時間：2-5 秒
- 移動處理時間：5-10 秒
- 頁面載入時間：< 2 秒
- 支援瀏覽器：Chrome 90+、Edge 90+、Firefox 89+、Safari 14.1+

---

## 二、需求分析

### 2.1 功能需求

**核心功能（v1.0）：**
- ✅ 圖片上傳（拖曳或選擇，支援 JPG/PNG/WebP）
- ✅ AI 去背處理（客戶端 WebGL，使用 ONNX Runtime Web）
- ✅ 背景替換（透明、白底、黑底、自訂顏色）
- ✅ 圖片下載（PNG 透明 / JPG 白底）
- ✅ 瀏覽器兼容性檢測
- ✅ 多語系支援（4 種語言）
- ✅ Google AdSense 整合
- ✅ 響應式設計（手機、平板、桌面）

**後端功能（v1.0）：**
- ✅ 提供 Next.js 應用（Express Server）
- ✅ `/health` 健康檢查
- ✅ `/api/version` 版本資訊
- ✅ 訪問日誌記錄
- ✅ 安全中間件（Helmet、CORS、Compression）

**未來擴展（v1.2+）：**
- 使用者帳號系統
- 伺服器端去背 API（降級方案）
- 付費功能
- 批次處理

### 2.2 非功能需求

**性能需求：**
- LCP < 2.5 秒
- 模型載入 < 5 秒（首次）/ < 1 秒（快取）
- 去背處理：桌面 2-5 秒、移動 5-10 秒

**安全需求：**
- 圖片不上傳伺服器
- HTTPS 加密傳輸
- CSP 防護
- Cloudflare WAF 防護

**可用性需求：**
- 無需登入註冊
- 支援 4 種語言
- 無障礙設計（WCAG 2.1 AA）

**可維護性需求：**
- 完整的文件
- 類型安全（TypeScript）
- 模組化設計

---

## 三、技術方案

### 3.1 技術架構

**前端：**
- Next.js 15.1.6 (App Router)
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 3.4.1 + shadcn/ui
- onnxruntime-web 1.19+ (WebGL backend)
- next-intl（多語系）

**後端：**
- Node.js 20 LTS
- Express 5.1.0
- PM2（進程管理）

**基礎設施：**
- VPS: 165.154.226.78 (2C/4GB, Ubuntu 22)
- Nginx（反向代理）
- Cloudflare（CDN + Proxy + SSL + WAF）

**AI 模型：**
- U²Net Lite (~4.7 MB) 或 MODNet Lightweight (~6-10 MB)
- 客戶端 WebGL 執行

### 3.2 系統架構圖

```
使用者瀏覽器
   ↓ (HTTPS)
Cloudflare CDN + Proxy + WAF
   ↓ (HTTP - Flexible SSL)
Nginx (Reverse Proxy)
   ↓
Express (Node.js)
   ↓
Next.js 15
   ↓
WebGL Runtime (onnxruntime-web)
   ↓
ONNX 模型（U²Net Lite / MODNet）
```

### 3.3 部署架構

**環境分離：**
- Development: `dev-ai.cloudto.io` (Port 3001, /var/www/ai-cloudto-io-dev)
- Production: `ai.cloudto.io` (Port 3000, /var/www/ai-cloudto-io-prd)

**DNS 配置：**
- Cloudflare DNS A 記錄，Proxy 開啟（橘色雲朵）
- SSL 模式：Flexible

---

## 四、架構決策

### 4.1 為什麼選擇客戶端處理？

**優點：**
- ✅ 隱私保護：圖片不上傳伺服器
- ✅ 降低成本：不需要 GPU 伺服器
- ✅ 可擴展性：無伺服器端計算瓶頸
- ✅ 快速回應：無網路傳輸延遲

**挑戰：**
- ⚠️ 瀏覽器兼容性（需要 WebGL）
- ⚠️ 移動裝置性能較差
- ⚠️ 模型大小限制（< 25 MB）

**解決方案：**
- 使用輕量化模型（U²Net Lite 4.7 MB）
- WebGL backend 加速
- 提供瀏覽器檢測和友善錯誤提示
- 未來可增加伺服器端 API 作為降級方案

### 4.2 為什麼保留 Express 後端？

**當前需求：**
- `/health` 和 `/api/version` endpoints
- 日誌記錄（訪問統計）
- 安全中間件

**未來擴展：**
- 使用者帳號系統（需資料庫）
- 伺服器端去背 API
- 付費功能整合
- 保持架構彈性

**為什麼不用 Cloudflare Pages？**
- 無法執行 Express Server
- 無法實作自訂 API
- 資料庫整合受限
- 供應商鎖定風險

### 4.3 為什麼選擇 VPS + Cloudflare 組合？

**Cloudflare 提供：**
- 全球 CDN 加速
- 免費 SSL 證書
- DDoS + WAF 防護
- 靜態資源快取

**VPS 提供：**
- 完全控制權
- Express 後端執行
- 未來資料庫整合
- 不依賴單一平台

**安全加固：**
- ✅ **Cloudflare IP 鎖定**：VPS 僅接受來自 Cloudflare IP 範圍的請求
- ✅ 防止繞過 Cloudflare 直接攻擊 VPS
- ✅ 即使使用 Flexible SSL，IP 鎖定提供額外安全層

---

## 五、實作範圍

### 5.1 Phase 1 - 核心功能開發

**前端開發（Waylon 負責）：**
1. Next.js 15 專案初始化（App Router + TypeScript）
2. 多語系架構（next-intl）
3. UI 組件開發：
   - UploadCard（上傳介面）
   - PreviewCanvas（預覽區）
   - BgSelector（背景選擇器）
   - DownloadButton（下載按鈕）
   - LanguageSwitcher（語言切換器）
   - BrowserCheck（瀏覽器檢測）
4. ONNX Runtime 整合（WebGL backend）
5. 圖片處理邏輯
6. 4 種語言翻譯整合

**後端開發（Costa 負責）：**
1. Express Server 設定
2. `/health` endpoint
3. `/api/version` endpoint
4. 安全中間件（Helmet、CORS、Compression）
5. 訪問日誌記錄
6. 靜態檔案服務

**UI/UX 設計（Lisa 負責）：**
1. 根據 design-system.md 設計 Figma 原型
2. 首頁設計
3. 結果頁設計
4. 關於頁設計
5. 多語系介面驗證

**DevOps 配置（Louis 負責）：**
1. Nginx 配置（Dev 和 Prod）
2. PM2 配置
3. Cloudflare DNS 設定
4. SSL 配置
5. 部署腳本

### 5.2 Phase 2 - 測試與驗收

**QA 測試（Lucia 負責）：**
1. E2E 測試（playwright）
2. 瀏覽器兼容性測試
3. 多語系測試
4. 響應式測試
5. 性能測試

**Code Review（Chris/Shawn 負責）：**
1. 後端代碼審查（Chris）
2. 前端代碼審查（Shawn）

---

## 六、風險評估

| 風險 | 可能性 | 影響 | 對策 |
|------|--------|------|------|
| WebGL 瀏覽器兼容性問題 | 中 | 高 | 提供瀏覽器檢測 + 友善提示 |
| 模型載入時間過長 | 低 | 中 | Cloudflare CDN + Service Worker |
| 移動裝置性能不足 | 中 | 中 | 限制圖片大小 + 處理時間提示 |
| AdSense 審核不通過 | 低 | 中 | 增加內容頁文字 |
| 開發時程延遲 | 中 | 中 | 清晰的任務分解和里程碑 |

---

## 七、時程規劃

| 階段 | 工作項目 | 負責人 | 預估時間 |
|------|---------|--------|---------|
| **OpenSpec Proposal** | 創建 proposal.md | CTO | 0.5 天 |
| **OpenSpec Design** | 創建 design.md | CTO + Leo | 1 天 |
| **OpenSpec Tasks** | 創建 tasks.md | CTO | 0.5 天 |
| **OpenSpec Spec** | 創建 spec.md | CTO | 1 天 |
| **前端開發** | UI + ONNX 整合 | Waylon | 5 天 |
| **後端開發** | Express + API | Costa | 2 天 |
| **UI/UX 設計** | Figma 原型 | Lisa | 2 天 |
| **DevOps 配置** | Nginx + PM2 + Cloudflare | Louis | 1 天 |
| **QA 測試** | E2E + 兼容性測試 | Lucia | 2 天 |
| **Code Review** | 前後端審查 | Chris + Shawn | 1 天 |
| **部署到 Dev** | 測試環境部署 | Louis | 0.5 天 |
| **CTO 驗收** | 最終審查 | CTO | 0.5 天 |

**總計預估：** 約 15-17 個工作天

---

## 八、資源需求

### 8.1 人力資源

| 角色 | 人員 | 工作量 | 備註 |
|------|------|--------|------|
| CTO | 本人 | 3 天 | OpenSpec 規劃 + 驗收 |
| 系統架構師 | Leo | 1 天 | 架構諮詢 |
| 前端工程師 | Waylon | 5 天 | 主要開發 |
| 後端工程師 | Costa | 2 天 | Express API |
| UI/UX 設計師 | Lisa | 2 天 | 視覺設計 |
| DevOps 工程師 | Louis | 1 天 | 部署配置 |
| QA 工程師 | Lucia | 2 天 | 測試 |
| Code Reviewer | Chris + Shawn | 1 天 | 代碼審查 |

### 8.2 技術資源

**現有資源：**
- ✅ VPS: 165.154.226.78 (2C/4GB)
- ✅ Cloudflare 帳號（已設定）
- ✅ Domain: cloudto.io

**需要取得：**
- ONNX 模型（U²Net Lite - 開源免費）
- Google AdSense 帳號（需申請）
- onnxruntime-web（開源免費）

### 8.3 成本預估

| 項目 | 成本 | 備註 |
|------|------|------|
| VPS (165.154.226.78) | $0 | 已有 |
| Cloudflare | $0 | 免費方案 |
| Domain (cloudto.io) | $0 | 已註冊 |
| ONNX 模型 | $0 | 開源免費 |
| 開發工具 | $0 | 開源工具 |
| **總計** | **$0** | 零額外成本 |

---

## 九、技術決策記錄（ADR）

### ADR-001: 選擇客戶端 WebGL 處理而非伺服器端

**決策：** 使用客戶端 WebGL + ONNX Runtime Web

**原因：**
- 隱私保護（核心賣點）
- 降低伺服器成本
- 無運算瓶頸

**替代方案：**
- 伺服器端 GPU 處理（成本高、隱私風險）

**後果：**
- 需要現代瀏覽器支援
- 移動裝置性能較差
- 可接受的權衡

### ADR-002: 使用 VPS + Express 而非 Cloudflare Pages

**決策：** 保留 Express 後端

**原因：**
- 需要 `/health` 和 `/api/version` endpoints
- 需要日誌記錄
- 保留未來擴展能力（帳號系統、資料庫）
- 不想完全依賴第三方平台

**替代方案：**
- Cloudflare Pages（無法執行後端代碼）

**後果：**
- 需要維護 VPS
- 需要 PM2 管理進程
- 可接受的複雜度

### ADR-003: 使用 next-intl 實作多語系

**決策：** 使用 next-intl

**原因：**
- Next.js 15 官方推薦
- TypeScript 類型安全
- App Router 原生支援

**替代方案：**
- i18next（學習曲線較高）

**後果：**
- 良好的開發體驗
- 完整的類型支援

### ADR-004: 預設繁體中文，不使用自動偵測

**決策：** 固定預設繁體中文

**原因：**
- 台灣/香港用戶瀏覽器常設定 en-US
- 自動偵測會誤判為英文
- 確保目標用戶體驗

**替代方案：**
- 瀏覽器自動偵測（風險高）

**後果：**
- 英文/簡中/日文用戶需手動切換
- 可接受的權衡

---

## 十、依賴關係

### 10.1 外部依賴

**必要依賴：**
- Cloudflare 服務正常運作
- VPS (165.154.226.78) 可訪問
- Google Fonts 可用
- ONNX 模型可下載

**可選依賴：**
- Google AdSense 審核通過（變現）
- GitHub/GitLab（版本控制）

### 10.2 團隊依賴

**關鍵路徑：**
1. CTO 批准 proposal → Leo 架構諮詢 → Design 階段
2. Design 批准 → Tasks 分解 → Spec 規格
3. Spec 完成 → 團隊並行開發
4. 開發完成 → QA 測試 → Code Review → 部署

**並行任務：**
- 前端開發（Waylon）|| 後端開發（Costa）
- UI 設計（Lisa）→ 前端整合（Waylon）
- DevOps（Louis）可提前準備環境

---

## 十一、成功標準

### 11.1 驗收標準

**功能驗收：**
- ✅ 可上傳圖片（JPG/PNG/WebP，< 2048px）
- ✅ 去背處理成功率 > 95%
- ✅ 可下載 PNG（透明）和 JPG（白底）
- ✅ 4 種語言正常切換
- ✅ `/health` 和 `/api/version` 正常回應

**性能驗收：**
- ✅ LCP < 2.5 秒
- ✅ 桌面處理時間 2-5 秒
- ✅ 模型載入 < 5 秒（首次）

**安全驗收：**
- ✅ 圖片不上傳伺服器（驗證 Network tab）
- ✅ HTTPS 正常運作
- ✅ CSP headers 正確設定

**兼容性驗收：**
- ✅ Chrome 90+ 正常運作
- ✅ Edge 90+ 正常運作
- ✅ Firefox 89+ 正常運作
- ✅ Safari 14.1+ 正常運作（可接受較慢）

### 11.2 品質標準

**代碼品質：**
- 單元測試覆蓋率 ≥ 80%
- ESLint 無錯誤
- TypeScript 無 any 類型

**文件品質：**
- 所有 API 有文件
- README 完整
- 部署指南可執行

---

## 十二、下一步行動

### 12.1 立即行動

**❓ 需要 CTO 批准：**
- [ ] 批准此 Proposal
- [ ] 確認技術方案
- [ ] 確認資源分配

**❓ 需要諮詢 Leo（系統架構師）：**
- [ ] 架構設計審查
- [ ] 技術選型確認
- [ ] 性能目標可行性評估

### 12.2 批准後行動

1. 諮詢 Leo 進行架構設計審查
2. 建立 `design.md`（詳細技術設計）
3. 建立 `tasks.md`（任務分解）
4. 建立 `spec.md`（詳細規格）
5. 委派任務給團隊成員

---

## 十三、附件

### 13.1 參考文件

- PRD: `docs/prd/ai.cloudto.io-PRD-v1.0.md` (v1.1)
- 設計系統: `docs/design/design-system.md`
- 部署指南: `docs/devops/devops-guide.md`
- 翻譯檔案: `locales/*.json` (4 種語言)

### 13.2 已完成的準備工作

- ✅ PRD v1.1 完成（技術可行性修訂）
- ✅ 設計系統規範完成（Lisa 交付）
- ✅ 部署指南完成（Dev/Prd 環境）
- ✅ 多語系翻譯檔案完成（4 種語言）
- ✅ next-intl 配置檔案完成

---

## 🎯 CTO 決策點

**請 CTO 審查並決定：**

**A. 批准此 Proposal，繼續進行**
- 諮詢 Leo 進行架構審查
- 進入 Design 階段

**B. 需要修改 Proposal**
- 請指出需要調整的部分

**C. 暫緩執行**
- 請說明原因

---

**提案狀態：** ⏳ 待 CTO 批准

**提案人簽名：** CTO (Antarose AI Tech Inc.)
**提案日期：** 2025-10-25
