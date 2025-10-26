# OpenSpec Tasks - CloudTools AI 工具平台任務分解

**基於**: proposal.md + design.md（已批准）
**日期**: 2025-10-26
**專案**: tools.cloudto.io 多工具平台架構重構
**總時程**: 13 天

---

## 📋 任務總覽

### 時程分配

| 階段 | 任務 | 天數 | 負責人 |
|------|------|------|--------|
| Phase 1 | 基礎設施（專案初始化 + 路由架構） | 2 天 | Waylon |
| Phase 2 | UI 框架（NavBar + 工具列 + 響應式） | 3 天 | Waylon |
| Phase 3 | 核心功能（RemoveBG 實現） | 3 天 | Costa + Waylon |
| Phase 4 | 測試驗證（QA 測試 + SEO 驗證） | 2 天 | Lucia/Ann + Lily |
| Phase 5 | 部署上線（Dev 部署 + Prd 部署） | 2 天 | Louis |
| Phase 6 | CTO 驗收 | 1 天 | CTO |
| **總計** | | **13 天** | |

---

## Phase 1: 基礎設施（Day 1-2）

### Day 1: 專案初始化

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T1.1**: 初始化 Next.js 15 專案
  - 使用 `create-next-app@latest`
  - 選擇 App Router + TypeScript + Tailwind CSS
  - **驗收**: 專案可正常啟動 `npm run dev`

- [ ] **T1.2**: 安裝核心依賴
  ```bash
  npm install @radix-ui/react-icons @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-toast
  npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  npm install zustand next-intl lucide-react
  npm install class-variance-authority clsx tailwind-merge
  ```
  - **驗收**: 所有依賴安裝成功，無錯誤

- [ ] **T1.3**: 配置開發工具
  - ESLint + Prettier 配置
  - Husky Git hooks
  - TypeScript 嚴格模式
  - **驗收**: `npm run lint` 通過

- [ ] **T1.4**: 建立專案目錄結構
  ```
  app/[locale]/[tool]/
  components/NavBar/, components/ToolBar/, components/RemoveBG/
  stores/, lib/, types/
  ```
  - **驗收**: 目錄結構符合 design.md 第 13.2 節

- [ ] **T1.5**: 配置環境變數
  - `.env.development` (devtools.cloudto.io)
  - `.env.production` (tools.cloudto.io)
  - **驗收**: 環境變數正確載入

- [ ] **T1.6**: Git 初始化並推送到 develop 分支
  - 初始 commit
  - 推送到遠端 develop 分支
  - **驗收**: GitHub 上可見 develop 分支

#### 驗收標準
- ✅ 專案可正常啟動
- ✅ 所有依賴安裝完成
- ✅ ESLint/Prettier 配置正確
- ✅ 目錄結構完整
- ✅ 環境變數配置正確
- ✅ 已推送到 develop 分支

---

### Day 2: 路由架構

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T2.1**: 實現 `[locale]` 動態路由
  - 建立 `app/[locale]/layout.tsx`
  - 建立 `app/[locale]/page.tsx`
  - **驗收**: `/zh-tw`, `/en`, `/zh-cn`, `/ja` 可訪問

- [ ] **T2.2**: 配置 next-intl 國際化
  - 建立 `locales/` 目錄
  - 建立 `locales/zh-tw.json`, `en.json`, `zh-cn.json`, `ja.json`
  - 建立 `i18n.ts` 配置
  - 建立 `middleware.ts` 語言檢測
  - **驗收**: `useTranslations` hook 可正常使用

- [ ] **T2.3**: 實現 `[tool]` 動態路由
  - 建立 `app/[locale]/[tool]/page.tsx`
  - 建立 `app/[locale]/[tool]/layout.tsx`
  - **驗收**: `/zh-tw/removebg` 可訪問

- [ ] **T2.4**: 實現首頁重定向邏輯
  - 修改 `app/[locale]/page.tsx` 重定向到 `/[locale]/removebg`
  - **驗收**: 訪問 `/zh-tw` 自動跳轉到 `/zh-tw/removebg`

- [ ] **T2.5**: 實現客製化 404 頁面（Coming Soon）
  - 建立 `app/[locale]/not-found.tsx`
  - Coming Soon 風格設計
  - **驗收**: 訪問 `/zh-tw/compress` 顯示 Coming Soon 頁面

- [ ] **T2.6**: 測試多語言路由
  - 測試所有語言版本（zh-tw, en, zh-cn, ja）
  - 測試工具路由（removebg, compress, crop, convert）
  - **驗收**: 所有路由正常工作

#### 驗收標準
- ✅ 多語言路由正常（4 種語言）
- ✅ 工具動態路由正常
- ✅ 首頁自動重定向到 `/removebg`
- ✅ Coming Soon 404 頁面正常顯示
- ✅ 所有路由測試通過

---

## Phase 2: UI 框架（Day 3-5）

### Day 3: NavBar 組件

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T3.1**: 建立 NavBar 基礎結構
  - 建立 `components/NavBar/NavBar.tsx`
  - 固定頂部（fixed top-0）
  - 高度 64px (h-16)
  - **驗收**: NavBar 顯示在頁面頂部

- [ ] **T3.2**: 實現 Logo + 品牌名稱
  - 建立 `components/NavBar/Logo.tsx`
  - 「CloudTools AI」文字
  - **驗收**: Logo 和品牌名稱正確顯示

- [ ] **T3.3**: 實現語言切換器（NavBar 右側）
  - 建立 `components/NavBar/LanguageSwitcher.tsx`
  - 使用 Radix UI Select
  - 支援 4 種語言切換
  - **驗收**: 語言切換功能正常

- [ ] **T3.4**: NavBar 響應式設計
  - 桌面端：完整顯示
  - 移動端：簡化顯示
  - **驗收**: 桌面和移動端顯示正常

- [ ] **T3.5**: 單元測試
  - 測試 NavBar 渲染
  - 測試語言切換功能
  - **驗收**: 測試覆蓋率 ≥ 80%

#### 驗收標準
- ✅ NavBar 固定在頂部，高度 64px
- ✅ Logo 和品牌名稱顯示正確
- ✅ 語言切換器在右側，功能正常
- ✅ 響應式設計正確
- ✅ 單元測試通過

---

### Day 4: 桌面端工具列

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T4.1**: 建立 DesktopToolBar 組件
  - 建立 `components/ToolBar/DesktopToolBar.tsx`
  - 左側固定位置
  - **驗收**: 工具列顯示在左側

- [ ] **T4.2**: 整合 @dnd-kit 拖放功能
  - 使用 `DndContext` 和 `SortableContext`
  - 實現工具項目可拖動排序
  - **驗收**: 工具可拖動排序

- [ ] **T4.3**: 實現工具列收合功能
  - 展開狀態（w-64）：顯示完整工具名稱
  - 收合狀態（w-16）：僅顯示圖標
  - 收合按鈕
  - **驗收**: 收合/展開功能正常

- [ ] **T4.4**: GPU 加速優化
  - 使用 `transform: translate3d()`
  - 使用 `will-change: transform`
  - **驗收**: 拖動流暢，60fps

- [ ] **T4.5**: Zustand 狀態管理
  - 建立 `stores/toolStore.ts`
  - 實現工具排序邏輯
  - 實現 localStorage 持久化
  - **驗收**: 工具順序和收合狀態可持久化

- [ ] **T4.6**: 工具 Active 狀態同步
  - 根據當前 URL 高亮對應工具
  - **驗收**: 當前工具圖標高亮顯示

- [ ] **T4.7**: 單元測試
  - 測試拖放功能
  - 測試收合功能
  - 測試狀態持久化
  - **驗收**: 測試覆蓋率 ≥ 80%

#### 驗收標準
- ✅ 工具列顯示在左側，可拖動排序
- ✅ 收合/展開功能正常
- ✅ GPU 加速，拖動流暢
- ✅ Zustand 狀態管理正常
- ✅ localStorage 持久化正常
- ✅ Active 狀態正確高亮
- ✅ 單元測試通過

---

### Day 5: 移動端工具列

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T5.1**: 建立 MobileTabBar 組件
  - 建立 `components/ToolBar/MobileTabBar.tsx`
  - 底部固定（fixed bottom-0）
  - 高度 64px (h-16)
  - **驗收**: 移動端顯示底部 Tab Bar

- [ ] **T5.2**: 實現工具切換功能
  - 顯示所有工具圖標
  - 點擊跳轉到對應工具頁面
  - **驗收**: 工具切換正常

- [ ] **T5.3**: Active 狀態同步
  - 當前工具高亮顯示
  - **驗收**: Active 狀態正確

- [ ] **T5.4**: 響應式切換邏輯
  - 桌面端（≥768px）：顯示 DesktopToolBar
  - 移動端（<768px）：顯示 MobileTabBar
  - **驗收**: 響應式切換正常

- [ ] **T5.5**: 避免 Scroll Bar 優化
  - 主內容區域高度計算
  - 移動端：`h-[calc(100vh-8rem)]`（NavBar + TabBar）
  - 桌面端：`h-[calc(100vh-4rem)]`（僅 NavBar）
  - **驗收**: 無不必要的滾動條

- [ ] **T5.6**: 單元測試
  - 測試 MobileTabBar 渲染
  - 測試工具切換
  - 測試響應式邏輯
  - **驗收**: 測試覆蓋率 ≥ 80%

#### 驗收標準
- ✅ 移動端底部 Tab Bar 顯示正常
- ✅ 工具切換功能正常
- ✅ Active 狀態正確
- ✅ 響應式切換邏輯正常
- ✅ 無不必要的滾動條
- ✅ 單元測試通過

---

## Phase 3: 核心功能（Day 6-8）

### Day 6: RemoveBG 後端 API

**負責人**: Costa（後端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T6.1**: 建立 API Route
  - 建立 `app/api/removebg/route.ts`
  - 實現 POST handler
  - **驗收**: API endpoint 可訪問

- [ ] **T6.2**: 整合 remove.bg API（或自建 ONNX）
  - 如使用 remove.bg：整合第三方 API
  - 如自建：整合 ONNX Runtime Node.js
  - **驗收**: 去背功能正常

- [ ] **T6.3**: 錯誤處理邏輯
  - 檔案大小限制檢查
  - 格式驗證
  - 錯誤回應格式化
  - **驗收**: 錯誤處理完善

- [ ] **T6.4**: 單元測試
  - 測試 API endpoint
  - 測試錯誤處理
  - **驗收**: 測試覆蓋率 ≥ 80%

- [ ] **T6.5**: API 文檔
  - 撰寫 API 使用說明
  - **驗收**: 文檔完整

#### 驗收標準
- ✅ API endpoint 正常工作
- ✅ 去背功能正常
- ✅ 錯誤處理完善
- ✅ 單元測試通過
- ✅ API 文檔完整

---

### Day 7: RemoveBG 前端（1）

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T7.1**: 建立 RemoveBG 頁面
  - 修改 `app/[locale]/[tool]/page.tsx`
  - 實現 RemoveBG 工具頁面
  - **驗收**: 頁面可訪問

- [ ] **T7.2**: 建立圖片上傳組件
  - 建立 `components/RemoveBG/ImageUpload.tsx`
  - 支援拖放上傳
  - 支援點擊選擇
  - **驗收**: 上傳功能正常

- [ ] **T7.3**: 建立預覽組件
  - 建立 `components/RemoveBG/ImagePreview.tsx`
  - 顯示原圖和去背結果
  - **驗收**: 預覽顯示正常

- [ ] **T7.4**: 狀態管理（Zustand）
  - 建立 `stores/imageStore.ts`
  - 管理圖片狀態
  - **驗收**: 狀態管理正常

- [ ] **T7.5**: 單元測試
  - 測試上傳組件
  - 測試預覽組件
  - **驗收**: 測試覆蓋率 ≥ 80%

#### 驗收標準
- ✅ RemoveBG 頁面可訪問
- ✅ 圖片上傳功能正常
- ✅ 預覽顯示正常
- ✅ 狀態管理正常
- ✅ 單元測試通過

---

### Day 8: RemoveBG 前端（2）

**負責人**: Waylon（前端開發工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T8.1**: 處理進度顯示
  - 建立 `components/RemoveBG/ProcessingIndicator.tsx`
  - 顯示處理進度
  - **驗收**: 進度顯示正常

- [ ] **T8.2**: 結果展示
  - 建立 `components/RemoveBG/ResultDisplay.tsx`
  - 顯示去背結果
  - 前後對比功能
  - **驗收**: 結果展示正常

- [ ] **T8.3**: 下載功能
  - 建立 `components/RemoveBG/DownloadButton.tsx`
  - 支援 PNG 和 JPG 下載
  - **驗收**: 下載功能正常

- [ ] **T8.4**: 錯誤處理 UI
  - 錯誤訊息顯示
  - 友善的錯誤提示
  - **驗收**: 錯誤處理 UI 完善

- [ ] **T8.5**: 整合測試
  - 完整流程測試（上傳 → 處理 → 下載）
  - **驗收**: 完整流程正常

#### 驗收標準
- ✅ 處理進度顯示正常
- ✅ 結果展示正常
- ✅ 下載功能正常
- ✅ 錯誤處理 UI 完善
- ✅ 完整流程測試通過

---

## Phase 4: 測試驗證（Day 9-10）

### Day 9: QA 測試

**負責人**: Lucia & Ann（QA 工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T9.1**: Local 環境測試
  - 在 `http://localhost:5173` 測試
  - 完整功能測試
  - **驗收**: Local 測試通過

- [ ] **T9.2**: Dev 環境測試
  - 在 `https://devtools.cloudto.io` 測試
  - 完整功能測試
  - **驗收**: Dev 環境測試通過

- [ ] **T9.3**: E2E 測試（Playwright MCP tool）
  - 上傳圖片測試
  - 去背處理測試
  - 下載功能測試
  - 語言切換測試
  - **驗收**: E2E 測試通過

- [ ] **T9.4**: 跨瀏覽器測試
  - Chrome 測試
  - Firefox 測試
  - Safari 測試
  - **驗收**: 所有瀏覽器測試通過

- [ ] **T9.5**: 響應式測試
  - Desktop 測試
  - Tablet 測試
  - Mobile 測試
  - **驗收**: 所有裝置測試通過

- [ ] **T9.6**: Bug 回報
  - 記錄所有 Bug
  - 分級（Critical, High, Medium, Low）
  - 通知相關工程師修復
  - **驗收**: Bug 報告完整

#### 驗收標準
- ✅ Local 和 Dev 環境測試通過
- ✅ E2E 測試通過
- ✅ 跨瀏覽器測試通過
- ✅ 響應式測試通過
- ✅ 無 Critical/High 等級 Bug
- ✅ Bug 報告已提交

---

### Day 10: SEO 驗證

**負責人**: Lily（SEO 工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T10.1**: Meta Tags 檢查
  - 檢查 Title、Description、Keywords
  - 檢查 Open Graph tags
  - 檢查 Twitter Card tags
  - **驗收**: 所有 Meta tags 完整且正確

- [ ] **T10.2**: hreflang Tags 驗證
  - 檢查所有語言版本的 hreflang tags
  - 驗證 Canonical tags
  - **驗收**: hreflang tags 配置正確

- [ ] **T10.3**: Structured Data 檢查
  - 使用 Google Rich Results Test
  - 驗證 Schema.org JSON-LD
  - **驗收**: Structured data 無錯誤

- [ ] **T10.4**: Core Web Vitals 測試
  - 測試 LCP（目標 < 2.5s）
  - 測試 FID（目標 < 100ms）
  - 測試 CLS（目標 < 0.1）
  - **驗收**: 所有指標達標

- [ ] **T10.5**: Lighthouse 審計
  - 執行 Lighthouse SEO 審計
  - 目標分數 ≥ 90
  - **驗收**: Lighthouse SEO 分數 ≥ 90

- [ ] **T10.6**: 多語言版本驗證
  - 測試所有語言版本（zh-tw, en, zh-cn, ja）
  - 驗證語言切換功能
  - **驗收**: 所有語言版本正常

- [ ] **T10.7**: 提交 SEO 驗證報告
  - 撰寫詳細的 SEO 驗證報告
  - 提交給 CTO
  - **驗收**: SEO 驗證報告已提交

#### 驗收標準
- ✅ Meta tags 完整且正確
- ✅ hreflang tags 配置正確
- ✅ Structured data 無錯誤
- ✅ Core Web Vitals 達標
- ✅ Lighthouse SEO 分數 ≥ 90
- ✅ 多語言版本正常
- ✅ SEO 驗證報告已提交給 CTO

---

## Phase 5: 部署上線（Day 11-12）

### Day 11: Dev 環境部署

**負責人**: Louis（DevOps 工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T11.1**: 配置 Cloudflare DNS
  - 新增 A 記錄：devtools.cloudto.io → VPS IP
  - 啟用 Proxy（橙色雲朵）
  - **驗收**: DNS 解析正確

- [ ] **T11.2**: 配置 Nginx（Dev 環境）
  - 建立 `/etc/nginx/sites-available/devtools-cloudto-io`
  - 配置反向代理到 Port 3000
  - 啟用配置
  - **驗收**: Nginx 配置正確

- [ ] **T11.3**: 配置環境變數
  - 建立 `.env.development`
  - 設定 `NEXT_PUBLIC_API_URL=https://devtools.cloudto.io/api`
  - **驗收**: 環境變數正確

- [ ] **T11.4**: 推送到 develop 分支
  - 確認所有代碼已提交
  - 推送到遠端 develop 分支
  - **驗收**: develop 分支最新

- [ ] **T11.5**: 部署到 Dev 環境
  - SSH 到 VPS
  - Git pull develop 分支
  - `npm install && npm run build`
  - 啟動 PM2：`pm2 start npm --name "tools-dev" -- run dev`
  - **驗收**: Dev 環境部署成功

- [ ] **T11.6**: 驗證部署
  - 訪問 `https://devtools.cloudto.io`
  - 檢查所有功能正常
  - **驗收**: Dev 環境正常運行

- [ ] **T11.7**: QA 再次測試
  - Lucia/Ann 在 Dev 環境再次測試
  - **驗收**: Dev 環境測試通過

#### 驗收標準
- ✅ Cloudflare DNS 配置正確
- ✅ Nginx 配置正確
- ✅ 環境變數配置正確
- ✅ 代碼已推送到 develop 分支
- ✅ PM2 進程正常運行
- ✅ Dev 環境可正常訪問
- ✅ QA 再次測試通過

---

### Day 12: Prd 環境準備

**負責人**: Louis（DevOps 工程師）
**預估時間**: 1 天

#### 任務清單

- [ ] **T12.1**: 配置 Cloudflare DNS（Prd）
  - 新增 A 記錄：tools.cloudto.io → VPS IP
  - 啟用 Proxy（橙色雲朵）
  - **驗收**: DNS 解析正確

- [ ] **T12.2**: 配置 Nginx（Prd 環境）
  - 建立 `/etc/nginx/sites-available/tools-cloudto-io`
  - 配置反向代理到 Port 3001
  - 啟用配置
  - **驗收**: Nginx 配置正確

- [ ] **T12.3**: 配置環境變數（Prd）
  - 建立 `.env.production`
  - 設定 `NEXT_PUBLIC_API_URL=https://tools.cloudto.io/api`
  - **驗收**: 環境變數正確

- [ ] **T12.4**: 準備 PM2 配置（Prd）
  - 建立 PM2 cluster mode 配置
  - `pm2 start npm --name "tools-prd" --instances max -- start`
  - **驗收**: PM2 配置正確

- [ ] **T12.5**: 等待 CEO 批准
  - CTO 驗收完成後，提交 CEO 審批
  - 等待 CEO 最終批准
  - **驗收**: CEO 批准

- [ ] **T12.6**: Merge to master
  - **僅在 CEO 批准後執行**
  - `git checkout master && git merge develop`
  - `git push origin master`
  - **驗收**: master 分支已更新

- [ ] **T12.7**: 部署到 Prd 環境
  - **僅在 merge 到 master 後執行**
  - SSH 到 VPS
  - Git pull master 分支
  - `npm install && npm run build`
  - 啟動 PM2 cluster
  - **驗收**: Prd 環境部署成功

- [ ] **T12.8**: 驗證 Prd 環境
  - 訪問 `https://tools.cloudto.io`
  - 檢查所有功能正常
  - **驗收**: Prd 環境正常運行

#### 驗收標準
- ✅ Cloudflare DNS 配置正確（Prd）
- ✅ Nginx 配置正確（Prd）
- ✅ 環境變數配置正確（Prd）
- ✅ PM2 cluster mode 配置正確
- ✅ **等待 CEO 批准 merge 到 master**
- ✅ master 分支已更新
- ✅ Prd 環境部署成功
- ✅ Prd 環境正常運行

---

## Phase 6: CTO 驗收（Day 13）

### Day 13: 最終驗收

**負責人**: CTO
**預估時間**: 1 天

#### 任務清單

- [ ] **T13.1**: 檢查所有測試報告
  - Local 測試報告
  - Dev 環境測試報告（QA）
  - SEO 驗證報告（Lily）
  - **驗收**: 所有報告已提交且通過

- [ ] **T13.2**: 驗證 Dev 環境功能
  - 訪問 `https://devtools.cloudto.io`
  - 完整功能測試
  - **驗收**: Dev 環境功能正常

- [ ] **T13.3**: 檢查 SEO 驗證結果
  - 審查 Lily 的 SEO 驗證報告
  - 確認所有 SEO 指標達標
  - **驗收**: SEO 驗證通過

- [ ] **T13.4**: 審查代碼質量
  - Code Review 報告（Chris/Shawn）
  - TypeScript 無錯誤
  - ESLint 無警告
  - **驗收**: 代碼質量達標

- [ ] **T13.5**: 審查文檔完整性
  - README.md 完整
  - API 文檔完整
  - 技術文檔完整
  - **驗收**: 文檔完整

- [ ] **T13.6**: 最終批准決策
  - ✅ 所有測試通過
  - ✅ 代碼質量達標
  - ✅ SEO 驗證通過
  - ✅ 文檔完整
  - **做出批准決策**

- [ ] **T13.7**: 提交 CEO 審批 merge to master
  - **僅在所有檢查通過後**
  - CTO 提交完整驗收報告給 CEO
  - 等待 CEO 批准
  - CEO 批准後通知 Louis 可以 merge 到 master
  - **驗收**: CEO 批准通知已發出

- [ ] **T13.8**: 產出驗收報告
  - 撰寫最終驗收報告
  - 記錄所有驗收結果
  - **驗收**: 驗收報告已完成

#### 驗收標準
- ✅ 所有測試報告已審查
- ✅ Dev 環境功能正常
- ✅ SEO 驗證通過
- ✅ 代碼質量達標
- ✅ 文檔完整
- ✅ 最終批准決策已做出
- ✅ **提交 CEO 審批**
- ✅ 驗收報告已完成

---

## 📌 重要提醒

### 強制測試流程

**絕對不可跳過任何步驟**：

1. ✅ Local 測試通過（開發者）
2. ✅ Dev 環境線上測試通過（Lucia + Ann）
3. ✅ SEO 優化完成（Lily 驗證）
4. ✅ CTO 最終驗收
5. ✅ **提交 CEO 審批**
6. ✅ **等待 CEO 明確批准**
7. ✅ Merge 到 master
8. ✅ 部署到 Prd 環境

### Git 分支管理規則

- **Dev 環境** → `develop` 分支
- **Prd 環境** → `master` 分支
- ❌ **未經 CEO 批准，絕對不可 merge 到 master**

### CTO 追蹤機制

**CTO 會逐一確認每個階段的完成**：

- Phase 1 完成 → CTO 確認
- Phase 2 完成 → CTO 確認
- Phase 3 完成 → CTO 確認
- Phase 4 完成 → CTO 確認
- Phase 5 完成 → CTO 確認
- Phase 6 完成 → CTO 最終驗收

---

## 📊 總驗收標準

### 功能完整性
- ✅ 首頁正確重定向到 `/[locale]/removebg`
- ✅ RemoveBG 功能正常
- ✅ 工具列拖放功能正常（Desktop）
- ✅ 工具列收合功能正常（Desktop）
- ✅ 移動端 Tab Bar 功能正常
- ✅ 語言切換功能正常（zh-tw, en, zh-cn, ja）
- ✅ Coming Soon 404 頁面正常

### 測試覆蓋
- ✅ 單元測試覆蓋率 ≥ 80%
- ✅ E2E 測試通過
- ✅ Local 測試通過
- ✅ Dev 線上測試通過
- ✅ SEO 驗證通過

### 性能指標
- ✅ Lighthouse Performance ≥ 90
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1

### SEO 指標
- ✅ Lighthouse SEO ≥ 90
- ✅ Meta tags 完整
- ✅ hreflang tags 正確
- ✅ Structured data 無錯誤
- ✅ Mobile-Friendly

### 代碼質量
- ✅ 無 TypeScript 錯誤
- ✅ 無 ESLint 警告
- ✅ Code Review 通過
- ✅ 遵循 Conventional Commits

### 文檔完整性
- ✅ README.md 完整
- ✅ API 文檔完整
- ✅ 技術文檔完整
- ✅ 部署文檔完整

### 部署就緒
- ✅ Dev 環境部署成功
- ✅ 環境變數配置正確
- ✅ Cloudflare DNS 配置完成
- ✅ PM2 進程管理正常
- ✅ 回滾機制可用

---

**只有當以上所有條件均滿足時，CTO 才批准 merge to master 並部署到 Prd 環境。**

**文檔結束**
