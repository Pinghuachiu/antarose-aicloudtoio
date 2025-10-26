# OpenSpec Proposal: 域名遷移與多工具平台架構重構

**專案名稱**: tools.cloudto.io 多工具平台
**提案日期**: 2025-10-26
**提案人**: CTO
**架構師審查**: Leo（已完成）
**狀態**: ⏳ 待 CTO 審批

---

## 一、變更概述

### 1.1 變更類型
- ✅ 域名遷移（ai.cloudto.io → tools.cloudto.io）
- ✅ URL 路由架構重構（[locale] → [locale]/[tool]）
- ✅ 新增全局 UI 組件（NavBar + 可拖動工具列）
- ✅ 多工具平台擴展架構

### 1.2 變更原因
1. **業務擴展需求**：從單一「AI 去背工具」擴展為「多工具平台」
2. **SEO 與變現優化**：每個工具獨立頁面，利於 AdSense 廣告投放和流量追蹤
3. **用戶體驗提升**：統一的工具導航系統，便於用戶在不同工具間切換

### 1.3 預期效果
- ✅ 支援多個圖片處理工具（去背、壓縮、裁切、格式轉換）
- ✅ 每個工具有獨立 URL 和 SEO 優化
- ✅ 統一的品牌形象（tools.cloudto.io）
- ✅ 彈性的工具擴展架構

---

## 二、需求分析

### 2.1 核心需求

#### A. 域名與部署配置
| 項目 | 開發環境 | 生產環境 |
|------|---------|---------|
| 域名 | `devtools.cloudto.io` | `tools.cloudto.io` |
| URL 結構 | `/[locale]/[tool]` | `/[locale]/[tool]` |
| PM2 端口 | 3000 | 3001 |
| 舊域名處理 | - | 完全棄用（不重定向） |

**URL 範例**：
- `https://tools.cloudto.io/zh-tw/removebg`（繁中去背工具）
- `https://tools.cloudto.io/en/compress`（英文壓縮工具）
- `https://tools.cloudto.io/zh-cn/crop`（簡中裁切工具）
- `https://tools.cloudto.io/ja/convert`（日文格式轉換）

#### B. 工具列表規劃
| 工具 ID | 名稱 | 狀態 | Icon（lucide-react） |
|---------|------|------|---------------------|
| `removebg` | 去背 | ✅ 已實現 | `ImageMinus` |
| `compress` | 壓縮 | 🔜 預留 | `Minimize2` |
| `crop` | 裁切 | 🔜 預留 | `Crop` |
| `convert` | 格式轉換 | 🔜 預留 | `FileImage` |

#### C. UI 組件需求

**C.1 NavBar（頂部導航列）**
- 位置：頁面頂部固定
- 高度：64px（h-16）
- 內容：由 Lisa（UI/UX Designer）設計
- 約束：整體畫面避免出現 Scroll Bar

**C.2 可拖動工具列**
- 預設位置：左側中間
- 拖動範圍：可自由拖到畫面任意位置（類似 Photoshop 浮動面板）
- 位置儲存：localStorage
- 重置功能：提供「重置為預設位置」按鈕（Lisa 設計位置）
- Icon 庫：lucide-react
- UI 框架：shadcn/ui
- 功能：
  - 顯示所有工具的 icon
  - 點擊 icon 跳轉到對應工具頁面（URL 改變）
  - 當前工具的 icon 顯示 active 狀態（高亮）
  - 工具列在所有頁面全局顯示

#### D. 頁面路由行為
- 每個工具有獨立頁面和 URL
- 點擊工具列 icon → 跳轉到對應工具頁面
- 利於 AdSense 廣告投放（每個頁面都有流量）
- 利於 SEO（每個工具獨立的 meta tags）

### 2.2 非功能性需求

#### A. 性能要求
- 頁面切換速度：< 500ms（Next.js prefetch）
- 工具列拖動流暢度：60fps（GPU 加速）
- Lighthouse 評分：≥ 90 分

#### B. 兼容性要求
- 桌面瀏覽器：Chrome 90+, Edge 90+, Firefox 89+, Safari 14.1+
- 移動裝置：iOS Safari 14.1+, Chrome for Android 90+
- 響應式設計：工具列在移動裝置上自動調整

#### C. SEO 要求
- 每個工具頁面獨立的 title、description、keywords
- hreflang 標籤支援多語系
- sitemap.xml 包含所有工具頁面
- 使用 generateStaticParams() 預渲染（SSG）

---

## 三、架構師評估結果（Leo）

### 3.1 可行性評估
**結論**：✅ 可行，但需要謹慎規劃

**架構師建議**：
1. **路由架構**：使用 Next.js 15 App Router 的 `[locale]/[tool]` 動態路由
2. **拖放庫**：推薦 `@dnd-kit/core`（現代化、支援觸控、與 shadcn/ui 整合良好）
3. **狀態管理**：推薦 `Zustand` + persist middleware（輕量、支援 localStorage）
4. **部署架構**：Nginx + PM2 cluster + Cloudflare CDN

### 3.2 技術方案摘要

#### A. Next.js 路由結構
```plaintext
app/
├── [locale]/
│   ├── layout.tsx          # 包含 NavBar + 工具列
│   ├── page.tsx            # 首頁（工具選擇頁）
│   ├── [tool]/
│   │   ├── page.tsx        # 工具頁面
│   │   ├── loading.tsx     # 加載狀態
│   │   ├── error.tsx       # 錯誤處理
│   │   └── not-found.tsx   # 工具不存在 404
│   └── not-found.tsx       # 語系不存在 404
```

#### B. 新增依賴
```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/utilities": "^3.2.2",
    "zustand": "^4.5.0"
  }
}
```

#### C. 部署配置
- **Nginx**：兩個 server block（devtools + tools）
- **PM2**：兩個實例（dev + prod）
- **Cloudflare DNS**：兩個 A 記錄（Proxied）

### 3.3 預估工作量
**總計**：13 個工作日（約 2.5 週）

| 階段 | 工作內容 | 預估時間 |
|------|---------|---------|
| 階段一 | 路由架構調整 | 3 天 |
| 階段二 | 可拖動工具列實現 | 4 天 |
| 階段三 | 多環境部署配置 | 2 天 |
| 階段四 | UI/UX 整合與測試 | 3 天 |
| 階段五 | 部署與監控 | 1 天 |

---

## 四、影響評估

### 4.1 正面影響
| 項目 | 影響 |
|------|------|
| **SEO** | ✅ 每個工具獨立頁面，利於搜尋引擎索引 |
| **變現** | ✅ 每個頁面可放置 AdSense，增加廣告曝光 |
| **用戶體驗** | ✅ 統一的工具導航，便於切換 |
| **擴展性** | ✅ 易於新增更多工具 |
| **品牌統一** | ✅ tools.cloudto.io 更符合多工具平台定位 |

### 4.2 潛在風險

| 風險 | 等級 | 影響 | 對策 |
|------|------|------|------|
| **SEO 流量損失** | 🟠 中 | 舊域名流量無法轉移 | 1. 監控 Google Analytics<br>2. 提交新 sitemap 到 Search Console<br>3. 建議：保留舊域名 3 個月並設定 301 重定向（降低風險） |
| **路由配置錯誤** | 🟠 中 | 出現 404 錯誤 | 1. 完善的單元測試<br>2. E2E 測試（Playwright MCP）<br>3. 部署前在 dev 環境完整測試 |
| **工具列拖放在移動裝置體驗差** | 🟡 低 | 移動用戶體驗下降 | 1. 移動裝置預設收合工具列<br>2. 提供固定底部 Tab Bar 替代方案 |
| **localStorage 跨瀏覽器不同步** | 🟢 極低 | 不同瀏覽器位置不一致 | 預期行為，未來可考慮伺服器端儲存 |

### 4.3 技術債務風險
- **中等風險**：多語系路由驗證邏輯複雜度增加
- **對策**：統一在 middleware.ts 處理語系和工具驗證

---

## 五、建議方案

### 5.1 推薦實施方案

**方案 A（推薦）：完全遷移 + 分階段部署**

**特點**：
- ✅ 完全遷移到 tools.cloudto.io（符合需求）
- ✅ 分階段部署（dev → staging → production）
- ✅ 完善的測試覆蓋（單元測試 + E2E 測試）
- ⚠️ SEO 風險較高（無 301 重定向）

**優點**：
- 符合用戶需求（不保留舊域名）
- 架構清晰，無歷史包袱

**缺點**：
- SEO 流量可能在短期內下降

**風險對策**：
1. 提交新 sitemap 到 Google Search Console
2. 手動請求重新索引
3. 監控 Google Analytics 流量變化
4. 準備 SEO 優化措施（meta tags、structured data）

---

### 5.2 替代方案（僅供參考）

**方案 B：保留舊域名 3 個月 + 301 重定向**

**特點**：
- ✅ 降低 SEO 風險
- ✅ 平穩過渡
- ⚠️ 需要額外維護舊域名配置

**優點**：
- SEO 評分不會大幅下降
- 給搜尋引擎足夠的時間重新索引

**缺點**：
- 需要維護兩個域名配置（增加複雜度）
- 與用戶需求不符（用戶明確表示不重定向）

**建議**：
- 如果 SEO 流量對業務至關重要，建議採用此方案
- 如果優先考慮架構簡潔，採用方案 A

---

## 六、實施計畫概要

### 6.1 開發流程（OpenSpec）

1. ✅ **Proposal Phase**（當前階段）
   - ✅ 分析用戶需求
   - ✅ 諮詢 Leo（系統架構師）
   - ✅ 創建 proposal.md
   - ⏳ **等待 CTO 審批**

2. ⏭️ **Design Phase**（CTO 批准後）
   - 創建 design.md（詳細技術設計）
   - 包含架構圖、API 變更、資料庫變更

3. ⏭️ **Task Breakdown**
   - 創建 tasks.md（任務分解）
   - 分配任務給團隊成員
   - 定義驗收標準

4. ⏭️ **Specification**
   - 創建 spec.md（詳細規格）
   - 定義需求、約束、標準

5. ⏭️ **Implementation**
   - 委派任務給團隊成員
   - 監控進度

6. ⏭️ **Acceptance**
   - CTO 最終驗收
   - Leo 更新技術文件

### 6.2 團隊分工（預估）

| 團隊 | 負責內容 | 預估時間 |
|------|---------|---------|
| **Waylon**（前端開發） | 路由架構調整 + 工具列實現 | 7 天 |
| **Mark**（前端開發） | Bug 修復 | 待定 |
| **Lisa**（UI/UX） | NavBar 設計 + 工具列 UI 優化 | 2 天 |
| **Louis**（DevOps） | 多環境部署配置 | 2 天 |
| **Lucia + Ann**（QA） | E2E 測試 + 驗收測試 | 3 天 |
| **Lily**（SEO） | SEO 驗證與優化 | 1 天 |
| **Leo**（架構師） | 技術文件更新 | 2 天 |

---

## 七、CTO 決策檢查清單

作為 CTO，請您確認以下事項：

### 7.1 核心需求確認
- [ ] 確認域名完全遷移到 `tools.cloudto.io`（不保留舊域名）
- [ ] 確認 URL 結構為 `/[locale]/[tool]`
- [ ] 確認工具列表：removebg（已實現）+ compress/crop/convert（預留）
- [ ] 確認工具列可自由拖動到任意位置
- [ ] 確認位置儲存在 localStorage
- [ ] 確認點擊工具列 icon 會跳轉到對應工具頁面（URL 改變）
- [ ] 確認使用 lucide-react 作為 icon 庫

### 7.2 風險接受確認
- [ ] 接受 SEO 流量可能短期下降的風險（無 301 重定向）
- [ ] 接受 13 天開發時程
- [ ] 接受分階段部署策略

### 7.3 資源分配確認
- [ ] 批准前端團隊（Waylon + Mark）投入 7 天開發
- [ ] 批准 Lisa 投入 2 天 UI 設計
- [ ] 批准 Louis 投入 2 天 DevOps 配置
- [ ] 批准 QA 團隊（Lucia + Ann）投入 3 天測試
- [ ] 批准 Lily 投入 1 天 SEO 驗證

### 7.4 技術方案確認
- [ ] 批准使用 @dnd-kit/core 作為拖放庫
- [ ] 批准使用 Zustand 作為狀態管理
- [ ] 批准 Next.js 15 App Router 路由架構調整
- [ ] 批准 Nginx + PM2 多環境部署方案

---

## 八、下一步行動

### 8.1 CTO 批准後
1. Leo 創建 `design.md`（詳細技術設計）
2. CTO 審查並批准 design.md
3. CTO 創建 `tasks.md`（任務分解）
4. CTO 創建 `spec.md`（詳細規格）
5. 開始實施階段

### 8.2 CTO 拒絕或需要修改
1. CTO 提出修改意見
2. 重新諮詢 Leo
3. 更新 proposal.md
4. 重新提交審批

---

## 九、附錄

### 9.1 參考文件
- `docs/prd/ai.cloudto.io-PRD-v1.0.md`（產品需求文檔）
- `docs/architecture/system-design.md`（系統設計文檔）
- Leo 的架構評估報告（已完成）

### 9.2 關鍵術語
- **OpenSpec**：規格驅動開發流程
- **SSG**：Static Site Generation（靜態站點生成）
- **SSR**：Server-Side Rendering（伺服器端渲染）
- **ADR**：Architecture Decision Record（架構決策記錄）

---

## 十、CTO 審批區

**審批結果**：⏳ 待審批

**審批意見**：


**審批簽名**：


**審批日期**：


---

**提案結束，等待 CTO 審批。**
