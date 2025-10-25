# 🧠 產品需求文檔 (PRD)
## 專案名稱：ai.cloudto.io
### 版本：v1.1 (技術可行性修訂版)
### 作者：Jackal
### 日期：2025-10-25
### 修訂：CTO Technical Review

---

## 一、產品概述

**ai.cloudto.io 去背小幫手**是一款「免登入、全本地執行」的 AI 圖片去背工具網站，
專為繁體中文使用者設計。
核心理念：**快速、安全、私密**。
所有圖片處理均於瀏覽器端透過 **WebGL 加速** + ONNX Runtime Web 執行，
不經伺服器上傳，提供輕量且可信任的使用體驗。

---

## 二、產品目標

| 目標 | 描述 |
|------|------|
| 🪶 極輕部署 | 在 2 Core / 4 GB VPS 上即可穩定運行 |
| 🔒 高隱私 | 所有圖片處理於本地完成，不上傳伺服器 |
| 🚀 高性能 | WebGL 加速，桌面 2-5 秒、移動 5-10 秒完成處理 |
| 🧩 架構彈性 | 保留後端擴展能力，支援未來功能迭代 |
| 💰 可變現 | 支援 Google AdSense + 贊助入口 |
| 🌐 在地化 | 全繁體中文介面 + 行動端優化 |

---

## 三、核心功能規格

### 1️⃣ 前端功能
| 模組 | 功能 | 技術 |
|------|------|------|
| 上傳介面 | 拖曳或選取圖片 (JPG/PNG/WebP)，**最大 2048x2048px** | `<input type="file">` + shadcn/Button |
| 去背處理 | 使用 ONNX 模型 (U²Net Lite / MODNet) 透過 WebGL 加速執行 | `onnxruntime-web` (WebGL backend) |
| 預覽區 | 顯示原圖 / 去背結果 (透明背景) + 切換滑桿 | React Canvas + Tailwind |
| 背景替換 | 選擇白底、純色或自定圖片 | `<select>` + Canvas 合成 |
| 下載輸出 | 一鍵下載 PNG (透明) 或 JPG (白底) | `toBlob()` / `FileSaver.js` |
| 瀏覽器檢測 | 自動偵測 WebGL / WASM 支援度 | `ort.env.wasm` + WebGL detection |
| 多語系支援 | 支援繁中/簡中/英文/日文，URL 路徑區分，自動偵測 | next-intl + Next.js 15 Middleware |
| 廣告區塊 | 插入 AdSense 橫幅（首頁與結果頁） | `<ins class="adsbygoogle">` |
| 響應式設計 | 手機版優化 (上下分區，單列按鈕) | Tailwind Flex Grid |

---

### 2️⃣ 後端功能
| 模組 | 功能 | 技術 | 用途 |
|------|------|------|------|
| 靜態資源 | 提供 Next.js build 結果與靜態檔案 | Express `static()` | 服務前端應用 |
| 安全層 | Header 防護、CORS、壓縮 | Helmet + CORS + Compression | 安全性與效能 |
| 健康檢查 | `/health` 回傳 200 狀態 | Express Router | 監控與負載平衡 |
| 版本 API | `/api/version` 回傳 commit hash / build time | Express Router | 版本追蹤 |
| 紀錄與監控 | 每次頁面載入紀錄 (user-agent + referrer) | Express Middleware + Logrotate | 分析與除錯 |
| 分析 | 接 GA4 事件 (上傳/下載/完成) | Google Analytics Tag Manager | 使用者行為追蹤 |
| **擴展性** | **保留後端擴展能力** | **Express 框架** | **未來功能基礎** |

**未來可擴展功能（保留後端能力）：**
- 使用者帳號系統（登入/註冊）
- 伺服器端去背 API（給不支援 WebGL 的裝置）
- 圖片歷史儲存服務
- 付費功能整合（支付 API）
- 批次處理 API
- 資料庫整合（PostgreSQL / MongoDB）

---

## 四、系統架構

### 完整架構圖（VPS + Express + Cloudflare CDN）

```
使用者瀏覽器
   ↓ (HTTPS)
Cloudflare CDN + Proxy + WAF
   ↓ (HTTP - Flexible SSL)
Nginx (Reverse Proxy)
   ↓
Express (Node.js 20 LTS)
   ↓
Next.js 15 App Router
   ↓
Client-side WebGL Runtime (onnxruntime-web)
   ↓
圖片去背模型 (U²Net Lite / MODNet)
```

### 架構說明

**Cloudflare 層（CDN + Proxy）：**
- DNS 解析（cloudto.io → Cloudflare IP）
- SSL/TLS 終止（Flexible SSL 模式）
- CDN 快取（靜態資源、模型檔案）
- WAF 防護（DDoS、Bot 攻擊）
- Always Use HTTPS 重定向
- **不執行任何應用程式邏輯**

**VPS 層（165.154.226.78）：**
- Nginx：反向代理，轉發請求到 Express
- Express：
  - 提供 Next.js 應用
  - `/health` 健康檢查
  - `/api/version` 版本資訊
  - 日誌記錄
  - 安全中間件（Helmet）
  - 未來 API endpoints
- PM2：進程管理，自動重啟

**客戶端層（瀏覽器）：**
- Next.js 前端應用（SSR 或 SSG）
- WebGL Runtime 執行 ONNX 模型
- 所有圖片處理在本地完成

### 架構決策原因

**為什麼選擇 VPS + Express + Cloudflare（僅 CDN）組合？**

**A. 當前需要的後端功能：**
1. ✅ `/health` endpoint - 用於監控和負載平衡
2. ✅ `/api/version` endpoint - 版本追蹤和除錯
3. ✅ 日誌記錄（user-agent + referrer）- 分析和除錯
4. ✅ Express middleware（Helmet、CORS、Compression）- 安全性和效能優化

**B. 未來擴展性考量：**
1. ✅ 使用者帳號系統（v1.2 規劃）
2. ✅ 伺服器端去背 API（v1.3 規劃，降級方案）
3. ✅ 付費功能整合（v2.0 規劃）
4. ✅ 資料庫整合（PostgreSQL / MongoDB）
5. ✅ 保持架構彈性，支援任何未來需求

**C. 技術偏好：**
1. ✅ 想要完全控制伺服器
2. ✅ 不想完全依賴第三方平台（Cloudflare Pages）
3. ✅ 已有 VPS (165.154.226.78)，充分利用資源

**D. Cloudflare Pages 的限制：**
- ❌ 無法執行 Express Server
- ❌ 無法實作自訂 API endpoints
- ❌ 無法記錄伺服器端日誌
- ❌ 資料庫整合受限（僅 D1）
- ❌ 供應商鎖定風險

**最終決策：採用 VPS + Express + Cloudflare（僅 CDN + Proxy）** ✅

### 部署配置

- **VPS 配置**：2 Core / 4 GB RAM / Ubuntu 22 / Node 20 LTS
- **Domain**：cloudto.io
- **SSL**：Cloudflare Flexible（Cloudflare 處理 HTTPS，VPS 使用 HTTP）
- **CDN**：Cloudflare Edge Cache
- **Cache**：
  - Cloudflare 快取靜態資源和模型檔案
  - Nginx gzip 壓縮
  - Express Compression middleware

---

## 五、技術棧版本

### 前端
- Next.js 15.1.6 (App Router with SSR/SSG)
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 3.4.1
- shadcn/ui + Radix UI
- Lucide React 0.546.0
- **onnxruntime-web 1.19+ (WebGL backend)**
- FileSaver.js (下載)
- **ONNX 模型**：U²Net Lite (~4.7 MB) 或 MODNet Lightweight (~6-10 MB)

### 後端
- Node.js 20 LTS
- Express 5.1.0
- Helmet 8.1.0（安全 headers）
- CORS 2.8.5（跨域控制）
- Compression 1.8.1（Gzip 壓縮）
- PM2（進程管理和自動重啟）
- Winston 或 Morgan（日誌記錄）

### 基礎設施
- Nginx（反向代理）
- Cloudflare（CDN + Proxy + SSL + WAF）
- Ubuntu 22.04 LTS
- Git（版本控制）

---

## 六、使用流程

1️⃣ **使用者開啟 cloudto.io**
   - 請求經過 Cloudflare CDN
   - Cloudflare 自動重定向到 HTTPS
   - Express 記錄訪問日誌（user-agent + referrer）
   - 系統自動偵測瀏覽器兼容性（WebGL / WASM）
   - 若不支援，顯示系統需求提示

2️⃣ **點擊「選擇圖片」或拖曳檔案**
   - 支援格式：JPG / PNG / WebP
   - **最大尺寸限制：2048 x 2048 px**
   - 超過限制自動壓縮並提示使用者
   - 顯示圖片預覽

3️⃣ **前端載入 ONNX 模型（首次訪問）**
   - 模型大小：**5-10 MB**
   - 透過 Cloudflare CDN 快速載入
   - 載入時間：約 1-3 秒（CDN 加速）
   - Service Worker 快取，第二次訪問秒開
   - 顯示載入進度條和百分比

4️⃣ **進行本地推論（WebGL 加速）**
   - **桌面裝置**：約 2-5 秒
   - **移動裝置**：約 5-10 秒
   - 顯示處理進度動畫
   - 可隨時取消處理

5️⃣ **使用者可以：**
   - 檢視前/後對照（滑桿切換）
   - 換背景色（白底 / 純色 / 自定圖片）
   - 下載去背圖（PNG 透明 / JPG 白底）
   - Express 記錄下載事件（統計分析）
   - 重新上傳其他圖片

6️⃣ **頁面底部顯示 AdSense 廣告**

7️⃣ **可選「贊助作者」連結（BuyMeACoffee / 綠界）**

---

## 七、UI 介面設計概述

### 首頁（/）
- Header：LOGO + 關於 + 隱私政策
- Hero 區：標題「AI 去背小幫手」＋副標「免登入・不上傳・全程本機處理」
- **系統需求提示**（若瀏覽器不支援）
- 上傳卡片（Card + Button）
- 使用說明區（3 步驟圖示）
- AdSense 橫幅

### 結果頁（去背後預覽）
- 兩張圖片對照滑桿
- 色盤選擇背景
- 下載按鈕（PNG / JPG）
- 重新上傳按鈕
- AdSense 方塊

### 關於頁（/about）
- 專案介紹、技術說明、開源授權
- **系統需求與瀏覽器兼容性說明**
- 連結 GitHub、BuyMeACoffee

---

## 八、系統需求與瀏覽器兼容性

### 最低系統需求

**桌面裝置：**
- Chrome 90+ / Edge 90+ / Firefox 89+ / Safari 14.1+
- 至少 4 GB RAM
- 支援 WebGL 2.0

**移動裝置：**
- iOS Safari 14.1+ / Chrome for Android 90+
- 至少 2 GB RAM
- 支援 WebGL

### 瀏覽器兼容性

| 瀏覽器 | 桌面 | 移動 | WebGL 支援 | 性能 |
|--------|------|------|------------|------|
| Chrome 90+ | ✅ | ✅ | 優秀 | 優秀 |
| Edge 90+ | ✅ | ✅ | 優秀 | 優秀 |
| Firefox 89+ | ✅ | ✅ | 良好 | 良好 |
| Safari 14.1+ | ✅ | ⚠️ | 受限 | 中等 |
| 其他 | ❌ | ❌ | 不支援 | - |

**說明：**
- ⚠️ Safari (iOS) 有 WebGL 記憶體限制，大圖片可能失敗
- 建議桌面使用 Chrome / Edge 以獲得最佳性能
- 移動裝置處理時間較長，建議使用較小圖片

### 錯誤處理與降級方案

**不支援的瀏覽器：**
- 顯示友善提示：「您的瀏覽器不支援此功能，請使用 Chrome / Edge / Firefox」
- 提供瀏覽器下載連結
- 未來可透過後端 API 提供降級支援

**記憶體不足：**
- 自動壓縮圖片並重試
- 若仍失敗，提示使用者選擇較小圖片
- 未來可透過後端 API 處理大圖片

**模型載入失敗：**
- 顯示錯誤訊息並提供重試按鈕
- 建議檢查網路連線
- 記錄錯誤到後端日誌系統

---

## 九、多語系支援 (i18n)

### 支援語言

| 語言 | 語言代碼 | URL 路徑 | 字體 | 優先級 |
|------|----------|----------|------|--------|
| 繁體中文 | zh-tw | `/` (預設) | Noto Sans TC | 最高 |
| English | en | `/en` | Inter | 高 |
| 简体中文 | zh-cn | `/zh-cn` | Noto Sans SC | 高 |
| 日本語 | ja | `/ja` | Noto Sans JP | 中 |

### URL 結構

```
https://ai.cloudto.io/          → 繁體中文（預設首頁）
https://ai.cloudto.io/en        → English
https://ai.cloudto.io/zh-cn     → 简体中文
https://ai.cloudto.io/ja        → 日本語

https://ai.cloudto.io/about     → 繁中關於頁
https://ai.cloudto.io/en/about  → 英文關於頁
https://ai.cloudto.io/zh-cn/about → 簡中關於頁
https://ai.cloudto.io/ja/about  → 日文關於頁
```

### 語言切換機制

**語言選擇邏輯：**
1. **首次訪問**：固定顯示繁體中文（避免誤判）
2. **已訪問過**：讀取 localStorage 中的語言偏好
3. **手動切換**：使用 Header 語言切換器
4. **記住選擇**：儲存到 localStorage，下次訪問自動套用

**不使用瀏覽器自動偵測的原因：**
- ⚠️ 台灣/香港用戶瀏覽器常設定為 `en-US`，會誤判為英文
- ⚠️ 可能導致繁體中文用戶看到英文介面
- ✅ 固定預設為繁體中文，確保目標用戶體驗

**語言切換器設計：**
```tsx
// Header 右上角
<Select>
  <SelectTrigger>
    🌐 繁體中文 ▾
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="zh-tw">🇹🇼 繁體中文</SelectItem>
    <SelectItem value="en">🇺🇸 English</SelectItem>
    <SelectItem value="zh-cn">🇨🇳 简体中文</SelectItem>
    <SelectItem value="ja">🇯🇵 日本語</SelectItem>
  </SelectContent>
</Select>
```

### 翻譯內容範圍

**完整翻譯項目：**
- ✅ UI 介面文字（按鈕、標籤、提示）
- ✅ 首頁 Hero 文案（標題、副標題、說明）
- ✅ 使用說明（3 步驟圖示 + 文字）
- ✅ 關於頁內容（專案介紹、技術說明）
- ✅ 隱私權政策
- ✅ 錯誤訊息（所有用戶可見的錯誤）
- ✅ SEO Meta Tags（Title、Description、Keywords）
- ✅ 系統需求說明
- ✅ 瀏覽器兼容性提示

### 技術實作方案

**使用 next-intl：**
- Next.js 15 App Router 官方推薦
- 完整 TypeScript 支援
- 自動路由處理
- Server Components 支援

**專案結構：**
```
locales/
├── zh-tw.json    # 繁體中文（預設）
├── en.json       # English
├── zh-cn.json    # 简体中文
├── ja.json       # 日本語
└── index.ts      # 語言配置
```

### 字體動態載入策略

**根據語言載入對應字體：**

```typescript
// app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { Noto_Sans_TC } from 'next/font/google';
import { Noto_Sans_SC } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTC = Noto_Sans_TC({ subsets: ['chinese-traditional'], variable: '--font-noto-tc' });
const notoSansSC = Noto_Sans_SC({ subsets: ['chinese-simplified'], variable: '--font-noto-sc' });
const notoSansJP = Noto_Sans_JP({ subsets: ['japanese'], variable: '--font-noto-jp' });

// 根據 locale 動態選擇字體
const fontMap = {
  'zh-tw': notoSansTC.variable,
  'zh-cn': notoSansSC.variable,
  'en': inter.variable,
  'ja': notoSansJP.variable,
};
```

### SEO 多語系優化

**每種語言獨立的 SEO：**

| 語言 | Title | Meta Description |
|------|-------|------------------|
| 繁中 | AI 去背小幫手｜免登入・不上傳・全程本機處理 | 免費線上圖片去背工具，支援 JPG/PNG/WebP，所有處理於瀏覽器完成，隱私安全又快速。 |
| 英文 | AI Background Remover｜No Login・Privacy First | Free online background removal tool with AI. Process images locally in browser with WebGL acceleration. |
| 簡中 | AI 去背小助手｜免登录・不上传・全程本地处理 | 免费在线图片去背工具，支持 JPG/PNG/WebP，所有处理在浏览器完成，隐私安全快速。 |
| 日文 | AI 背景除去ツール｜ログイン不要・プライバシー保護 | 無料オンライン画像背景除去ツール。ブラウザでAI処理、アップロード不要。 |

**hreflang 標籤：**
```html
<link rel="alternate" hreflang="zh-tw" href="https://ai.cloudto.io/" />
<link rel="alternate" hreflang="en" href="https://ai.cloudto.io/en" />
<link rel="alternate" hreflang="zh-cn" href="https://ai.cloudto.io/zh-cn" />
<link rel="alternate" hreflang="ja" href="https://ai.cloudto.io/ja" />
<link rel="alternate" hreflang="x-default" href="https://ai.cloudto.io/" />
```

### 翻譯品質保證

**機器翻譯 + 人工校對：**
- 初期：使用 AI 翻譯（Claude / GPT）
- 關鍵文案：人工校對
- 專業術語：建立術語表
- 持續優化：根據用戶反饋調整

---

## 十、SEO 與行銷設定

| 項目 | 值 |
|------|----|
| Title | AI 去背小幫手｜免登入・不上傳・全程本機處理 |
| Meta Description | 免費線上圖片去背工具，支援 JPG/PNG/WebP，所有處理於瀏覽器完成，隱私安全又快速。使用 WebGL 加速，桌面 2-5 秒完成。 |
| Keywords | 去背, AI 去背, 免登入去背, 圖片去背, 繁體中文, 背景移除, WebGL 去背 |
| OG Image | /og-image.png |
| Canonical | https://cloudto.io |
| Sitemap | 自動生成 `/sitemap.xml` |
| robots.txt | 開放索引首頁、去背頁、關於頁 |

---

## 十、安全與隱私

- ✅ 不上傳任何圖片到伺服器
- ✅ 不保存用戶資料或 IP 紀錄
- ✅ 所有圖片處理在瀏覽器本地完成（WebGL）
- ✅ 使用 Helmet 設定 CSP 防止 XSS
- ✅ 使用 HTTPS（Cloudflare SSL）保護通訊
- ✅ 提供「隱私權政策」頁面
- ✅ 符合 GDPR / CCPA 要求

---

## 十一、部署流程

### 標準部署流程（VPS + Express + PM2）

**詳細部署步驟請參考：** `docs/devops/devops-guide.md`

**快速部署指令：**

```bash
# 1. SSH 到 VPS
ssh 165.154.226.78

# 2. Clone repository
cd /var/www/ai-cloudto-io-dev  # 或 ai-cloudto-io-prd
git clone <repository-url> .

# 3. 安裝依賴
npm install

# 4. 建置應用
npm run build

# 5. 配置環境變數
cat > .env.development << 'EOF'
NODE_ENV=development
PORT=3001
# 其他環境變數
EOF

# 6. 啟動 PM2
pm2 start npm --name "ai-cloudto-io-dev" -- run start:dev
pm2 save

# 7. 配置 Nginx（參考 devops-guide.md）
# 8. 配置 Cloudflare DNS（參考 devops-guide.md）
```

### Cloudflare 設定（CDN + Proxy）

**DNS 設定：**
- A 記錄：`dev-ai.cloudto.io` → 165.154.226.78（Proxied: ON 🟧）
- A 記錄：`ai.cloudto.io` → 165.154.226.78（Proxied: ON 🟧）

**SSL/TLS 設定：**
- SSL 模式：**Flexible**（Cloudflare ↔ 用戶 HTTPS，Cloudflare ↔ VPS HTTP）
- Always Use HTTPS：啟用
- HSTS：啟用
- Minimum TLS Version：TLS 1.2

**快取設定：**
- 快取等級：標準
- 瀏覽器快取 TTL：遵循 header
- 自訂規則：
  - `/models/*.onnx` → Cache Everything, TTL 1 year
  - `*.wasm` → Cache Everything, TTL 1 year
  - `/api/*` → Bypass Cache

**WAF 設定：**
- 啟用 Cloudflare Managed Rules
- 啟用 Bot Fight Mode
- 啟用 DDoS Protection

---

## 十二、專案目錄結構

```
ai-cloudto-io/
├── app/                       # Next.js 15 App Router (多語系)
│   ├── [locale]/             # 動態語言路由
│   │   ├── layout.tsx        # 語言專屬 Layout
│   │   ├── page.tsx          # 首頁
│   │   ├── about/
│   │   │   └── page.tsx      # 關於頁
│   │   └── privacy/
│   │       └── page.tsx      # 隱私政策
│   ├── layout.tsx            # 根 Layout
│   └── not-found.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # 包含語言切換器
│   │   └── Footer.tsx
│   ├── ui/                   # shadcn/ui components
│   │   ├── UploadCard.tsx
│   │   ├── PreviewCanvas.tsx
│   │   ├── BgSelector.tsx
│   │   ├── DownloadButton.tsx
│   │   └── LanguageSwitcher.tsx  # 語言切換組件
│   └── BrowserCheck.tsx
├── lib/
│   ├── onnx-runtime.ts
│   ├── image-processing.ts
│   └── i18n.ts               # next-intl 配置
├── locales/                   # 多語系翻譯檔案
│   ├── zh-tw.json            # 繁體中文（預設）
│   ├── en.json               # English
│   ├── zh-cn.json            # 简体中文
│   ├── ja.json               # 日本語
│   └── index.ts              # 語言配置和型別
├── public/
│   ├── models/
│   │   └── u2net-lite.onnx   # ONNX 模型（5-10 MB）
│   ├── og-image.png
│   └── favicon.ico
├── styles/
│   └── globals.css
├── backend/                   # Express 後端
│   ├── server.ts
│   ├── routes/
│   │   ├── health.ts
│   │   └── version.ts
│   ├── middlewares/
│   │   ├── security.ts
│   │   ├── logging.ts
│   │   └── cors.ts
│   └── utils/
│       └── logger.ts
├── docs/                      # 文件
│   ├── design/
│   │   └── design-system.md
│   ├── devops/
│   │   └── devops-guide.md
│   └── prd/
│       └── ai.cloudto.io-PRD-v1.0.md
├── .env.development           # Dev 環境變數
├── .env.production            # Prod 環境變數
├── ecosystem.config.js        # PM2 配置
├── i18n.config.ts            # next-intl 配置
├── middleware.ts             # Next.js middleware（處理語言路由）
├── next.config.mjs
├── package.json
├── tailwind.config.ts        # Tailwind 配置（多語系字體）
└── tsconfig.json
```

---

## 十三、關鍵效能指標 (KPI)

| 指標 | 目標 | 說明 |
|------|------|------|
| LCP (最大內容繪製) | < 2.5 秒 | Core Web Vital，Cloudflare CDN 加速 |
| 初次模型載入 | < 5 秒 (首次) / < 1 秒 (CDN 快取) | Cloudflare Edge Cache |
| 去背處理時間 (桌面) | 2-5 秒 (1024px 圖片) | WebGL 加速 |
| 去背處理時間 (移動) | 5-10 秒 (1024px 圖片) | WebGL 加速 |
| 伺服器回應時間 | < 200ms | Express + Nginx |
| 頁面載入時間 | < 2 秒 | Next.js + Cloudflare CDN |
| 廣告 CTR | ≥ 2.5 % | 變現指標 |

---

## 十四、風險與對策

| 風險 | 影響 | 對策 |
|------|------|------|
| Safari/iOS WebGL 記憶體限制 | 大圖片可能失敗 | 限制圖片 2048px + 未來提供後端 API |
| 模型載入時間過長 | 首次體驗不佳 | Cloudflare CDN 加速 + Service Worker |
| 廣告未通過審核 | 無法變現 | 增加內容頁補充文字 |
| 瀏覽器不支援 WebGL | 無法使用 | 顯示提示 + 未來提供後端 API |
| VPS 單點故障 | 服務中斷 | PM2 自動重啟 + Cloudflare Always Online |
| 流量攻擊 | 服務過載 | Cloudflare WAF + Rate Limiting |

---

## 十五、版本規劃

| 階段 | 內容 | 目標時間 |
|------|------|-----------|
| v1.0 | 去背核心 (WebGL) + Express 後端 + Cloudflare CDN | 2025 Q4 |
| v1.1 | 背景替換 + 多語系 + AdSense | 2026 Q1 |
| v1.2 | 使用者帳號系統 + 圖片歷史 (需資料庫) | 2026 Q2 |
| v1.3 | 伺服器端去背 API (降級方案) | 2026 Q2 |
| v2.0 | 付費功能 + 批次處理 API + 高畫質模型 | 2026 Q3 |

---

## 十六、未來擴展功能（後端能力保留）

### 已規劃功能

**v1.2 - 使用者帳號系統：**
- Express + PostgreSQL / MongoDB
- JWT 身份驗證
- 使用者設定儲存
- 圖片歷史記錄

**v1.3 - 伺服器端去背 API：**
- 給不支援 WebGL 的裝置使用
- Python + ONNX Runtime（GPU）
- Express 轉發到 Python 服務
- 付費功能（限制次數）

**v2.0 - 進階功能：**
- 批次處理 API
- WebSocket 即時處理
- AI 智慧修邊
- 付費高畫質模型（伺服器端 GPU 加速）

### 技術架構演進

```
v1.0: Cloudflare → Nginx → Express → Next.js → WebGL (客戶端)

v1.2: Cloudflare → Nginx → Express → Next.js → WebGL
                              ↓
                        PostgreSQL (帳號系統)

v2.0: Cloudflare → Nginx → Express → Next.js → WebGL
                              ↓            ↓
                        PostgreSQL   Python API (GPU 去背)
```

---

## 十七、授權與版權

- 模型來源：U²Net / MODNet (Open Source, MIT / Apache 2.0)
- 前端框架與元件遵循各自開源授權
- 網站內容、UI 設計 © 2025 Jackal / CloudTo.io 保留所有權利

---

## 附錄 A：技術實作參考

### ONNX Runtime WebGL 配置範例

```typescript
import * as ort from 'onnxruntime-web';

// 配置 WebGL backend
ort.env.wasm.wasmPaths = '/wasm/';
ort.env.wasm.numThreads = 4;

const session = await ort.InferenceSession.create('/models/u2net-lite.onnx', {
  executionProviders: ['webgl', 'wasm'], // WebGL 優先，WASM 降級
  graphOptimizationLevel: 'all',
});
```

### Express Server 基本架構

```typescript
// backend/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(helmet());
app.use(cors());
app.use(compression());

// 日誌記錄
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log(`User-Agent: ${req.headers['user-agent']}`);
  console.log(`Referrer: ${req.headers['referer'] || 'Direct'}`);
  next();
});

// API Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/version', (req, res) => {
  res.json({
    version: process.env.APP_VERSION || '1.0.0',
    commit: process.env.GIT_COMMIT || 'unknown',
    buildTime: process.env.BUILD_TIME || 'unknown',
  });
});

// 提供 Next.js 靜態檔案
app.use(express.static(path.join(__dirname, '../frontend/out')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/out/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### PM2 Ecosystem 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'ai-cloudto-io-dev',
      script: 'npm',
      args: 'run start:dev',
      cwd: '/var/www/ai-cloudto-io-dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'ai-cloudto-io-prd',
      script: 'npm',
      args: 'run start',
      cwd: '/var/www/ai-cloudto-io-prd',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 2,  // 多實例負載平衡
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
```

### Nginx 配置範例

```nginx
# /etc/nginx/sites-available/ai-cloudto-io-dev
server {
    listen 80;
    server_name dev-ai.cloudto.io;

    # 限制請求大小（防止大檔案上傳攻擊）
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 靜態資源快取（模型檔案）
    location /models/ {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 附錄 B：Cloudflare 作為 CDN + Proxy 的優勢

### 為什麼選擇 Cloudflare + VPS 組合？

| 功能 | Cloudflare 提供 | VPS 提供 | 效果 |
|------|----------------|----------|------|
| 全球 CDN | ✅ | ❌ | 全球使用者都能快速訪問 |
| DDoS 防護 | ✅ | ❌ | 自動防禦攻擊 |
| SSL 證書 | ✅ 免費 | ⚠️ 需 Let's Encrypt | 簡化配置 |
| WAF 防護 | ✅ | ❌ | 阻擋惡意請求 |
| 靜態資源快取 | ✅ | ⚠️ 需自行配置 | 降低 VPS 負載 |
| 後端邏輯 | ❌ | ✅ | 完全控制 |
| 資料庫 | ❌ | ✅ | 未來擴展 |
| 自訂 API | ❌ | ✅ | 彈性擴展 |

**最佳組合：Cloudflare 的全球 CDN + VPS 的後端彈性** 🎯

---

## 附錄 C：為什麼不使用 Cloudflare Pages？

基於您的需求（A 全部 + B 全部 + C.2 + C.3），**Cloudflare Pages 不適合**，原因：

| 需求 | Cloudflare Pages | VPS + Express |
|------|------------------|---------------|
| `/health` endpoint | ❌ 無法實作 | ✅ |
| `/api/version` endpoint | ❌ 無法實作 | ✅ |
| 日誌記錄（user-agent） | ❌ 無法實作 | ✅ |
| Express middleware | ❌ 無法執行 | ✅ |
| 未來帳號系統 | ❌ 需用 Workers + D1 | ✅ 任意資料庫 |
| 未來伺服器端 API | ❌ 需用 Workers（有限制） | ✅ 完全支援 |
| 完全控制伺服器 | ❌ | ✅ |
| 不依賴第三方平台 | ❌ | ✅ |

**結論：您需要 VPS + Express + PM2 + Cloudflare（僅 CDN + Proxy）架構** ✅

---

## 📋 PRD v1.1 最終架構確認

**系統架構：**
```
Cloudflare (CDN + Proxy + SSL + WAF)
    ↓
Nginx (Reverse Proxy)
    ↓
Express (後端邏輯 + API)
    ↓
Next.js 15 (前端應用)
    ↓
WebGL (客戶端 AI 處理)
```

**關鍵特點：**
- ✅ Cloudflare 只負責 CDN、SSL、WAF（不執行應用邏輯）
- ✅ VPS 執行完整 Express 後端（保留擴展能力）
- ✅ 客戶端 WebGL 處理圖片（隱私保護）
- ✅ 可隨時擴展後端功能

---

## 附錄 D：next-intl 多語系實作範例

### 安裝依賴

```bash
npm install next-intl
```

### 配置檔案

**1. i18n.config.ts**（已建立）

```typescript
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './locales';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default,
  timeZone: 'Asia/Taipei',
  now: new Date(),
}));
```

**2. middleware.ts**（已建立）

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

export default createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false, // 不使用自動偵測
  localePrefix: 'as-needed', // 預設語言不顯示 /zh-tw
});
```

**3. next.config.mjs**

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 其他配置...
};

export default withNextIntl(nextConfig);
```

### 組件使用範例

**app/[locale]/layout.tsx**

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/locales';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 驗證語言代碼
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 載入翻譯檔案
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**app/[locale]/page.tsx**

```typescript
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('hero');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <p>{t('description')}</p>
      <button>{t('cta')}</button>
    </div>
  );
}
```

**components/LanguageSwitcher.tsx**

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales, localeNames, localeFlags } from '@/locales';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // 移除當前語言前綴
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // 加入新語言前綴（除非是預設語言）
    const newPath = newLocale === 'zh-tw'
      ? pathnameWithoutLocale
      : `/${newLocale}${pathnameWithoutLocale}`;

    router.push(newPath);
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue>
          {localeFlags[locale as keyof typeof localeFlags]} {localeNames[locale as keyof typeof localeNames]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeFlags[loc]} {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### 類型安全的翻譯

**自動生成類型定義：**

```typescript
// types/i18n.d.ts
type Messages = typeof import('../locales/zh-tw.json');
declare interface IntlMessages extends Messages {}
```

**在 tsconfig.json 中：**

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "next" }]
  },
  "include": ["types/**/*.ts"]
}
```

### 動態翻譯（帶變數）

```typescript
// 翻譯檔案
{
  "processing": "處理中 {{progress}}%"
}

// 使用
t('processing', { progress: 75 }) // "處理中 75%"
```

---

**本文件可交由 Claude Code CLI 作為實作規格依據。**

**修訂歷史：**
- v1.0 (2025-10-23): 初始版本
- v1.1 (2025-10-25): 技術可行性修訂（WebGL backend、簡化架構、更新性能目標、多語系支援）
