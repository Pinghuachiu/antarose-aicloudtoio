# OpenSpec Specification - CloudTools AI 工具平台詳細規格

**基於**: proposal.md + design.md + tasks.md（已批准）
**日期**: 2025-10-26
**專案**: tools.cloudto.io 多工具平台架構重構
**版本**: 1.0

---

## 📋 規格總覽

### 參考文件
- **PRD**: `docs/prd/ai.cloudto.io-PRD-v1.0.md`
- **Proposal**: `docs/specs/proposal.md`
- **Design**: `docs/specs/design.md`
- **Tasks**: `docs/specs/tasks.md`

### 核心目標
- ✅ 域名遷移到 tools.cloudto.io
- ✅ URL 路由重構為 `/[locale]/[tool]`
- ✅ 新增 NavBar + 可拖動工具列
- ✅ 支援多工具平台擴展

---

## 1. 功能性需求規格

### 1.1 域名與 URL 結構

#### 要求
| 項目 | 開發環境 | 生產環境 |
|------|---------|---------|
| **域名** | devtools.cloudto.io | tools.cloudto.io |
| **URL 結構** | `/[locale]/[tool]` | `/[locale]/[tool]` |
| **支援語言** | zh-tw, en, zh-cn, ja | zh-tw, en, zh-cn, ja |
| **Git 分支** | develop | master |

#### URL 範例
```
✅ https://tools.cloudto.io/zh-tw/removebg   (繁中去背工具)
✅ https://tools.cloudto.io/en/compress      (英文壓縮工具)
✅ https://tools.cloudto.io/zh-cn/crop       (簡中裁切工具)
✅ https://tools.cloudto.io/ja/convert       (日文格式轉換)
```

#### 驗證規則
- ✅ **語言代碼驗證**: 僅接受 `zh-tw`, `en`, `zh-cn`, `ja`
- ✅ **工具代碼驗證**: 僅接受 `removebg`, `compress`, `crop`, `convert`
- ❌ **無效語言**: 返回 404
- ❌ **無效工具**:
  - 如果是預留工具（compress, crop, convert）→ Coming Soon 404
  - 如果完全不存在 → 標準 404

---

### 1.2 首頁路由行為

#### 要求
訪問 `/[locale]`（例如 `/zh-tw`）時，自動重定向到 `/[locale]/removebg`

#### 實現方式
```typescript
// app/[locale]/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/removebg`);
}
```

#### 測試用例
| 輸入 URL | 預期輸出 | 狀態碼 |
|----------|---------|--------|
| `/zh-tw` | 重定向到 `/zh-tw/removebg` | 307 |
| `/en` | 重定向到 `/en/removebg` | 307 |
| `/zh-cn` | 重定向到 `/zh-cn/removebg` | 307 |
| `/ja` | 重定向到 `/ja/removebg` | 307 |

---

### 1.3 Coming Soon 404 頁面

#### 要求
- 預留工具（compress, crop, convert）顯示客製化 Coming Soon 404
- 設計風格友善，告知用戶功能即將推出
- 提供返回 removebg 工具的連結

#### UI 規格
```
┌─────────────────────────────────────┐
│                                     │
│          🚧 Coming Soon             │
│                                     │
│     這個工具即將推出，敬請期待！      │
│                                     │
│     [返回移除背景工具] ← 按鈕         │
│                                     │
└─────────────────────────────────────┘
```

#### 測試用例
| 輸入 URL | 預期輸出 | 狀態碼 |
|----------|---------|--------|
| `/zh-tw/compress` | Coming Soon 404 頁面 | 404 |
| `/zh-tw/crop` | Coming Soon 404 頁面 | 404 |
| `/zh-tw/convert` | Coming Soon 404 頁面 | 404 |
| `/zh-tw/invalid` | 標準 404 頁面 | 404 |

---

### 1.4 NavBar 組件規格

#### 功能需求
- ✅ 固定在頁面頂部
- ✅ 高度 64px (h-16)
- ✅ 包含 Logo + 品牌名稱
- ✅ 語言切換器（右側）
- ✅ 響應式設計

#### 技術約束
- **框架**: React 19 + TypeScript
- **樣式**: Tailwind CSS
- **組件庫**: Radix UI（語言切換器）
- **位置**: `components/NavBar/NavBar.tsx`

#### UI 規格（桌面端）
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] CloudTools AI            [🌐 繁體中文 ▾]        │ ← 64px
└─────────────────────────────────────────────────────────┘
```

#### UI 規格（移動端）
```
┌─────────────────────────────────────────┐
│ [☰] CloudTools         [🌐 ▾]          │ ← 64px
└─────────────────────────────────────────┘
```

#### 驗證規則
- ✅ NavBar 必須固定在頂部（`fixed top-0`）
- ✅ 高度必須為 64px（`h-16`）
- ✅ Logo 和品牌名稱必須可點擊，連結到首頁
- ✅ 語言切換器必須支援 4 種語言
- ✅ 語言切換後 URL 必須正確變更
- ✅ 響應式設計必須在 768px 斷點切換

---

### 1.5 桌面端工具列規格

#### 功能需求
- ✅ 可自由拖動到畫面任意位置
- ✅ 預設位置：左側中間
- ✅ 可拖動排序工具順序
- ✅ 可收合/展開
- ✅ 位置和順序儲存在 localStorage
- ✅ 顯示當前工具的 Active 狀態
- ✅ 點擊工具 icon 跳轉到對應頁面

#### 技術約束
- **拖放庫**: @dnd-kit/core + @dnd-kit/sortable
- **狀態管理**: Zustand + persist middleware
- **Icon 庫**: lucide-react
- **位置**: `components/ToolBar/DesktopToolBar.tsx`

#### UI 規格

**展開狀態（w-64, 256px）**:
```
┌─────────────────────┐
│ [📷] 去背              │
│ [🗜️] 壓縮  (Coming)   │
│ [✂️] 裁切  (Coming)   │
│ [🔄] 轉換  (Coming)   │
│                     │
│                     │
│        [◀]          │ ← 收合按鈕
└─────────────────────┘
```

**收合狀態（w-16, 64px）**:
```
┌────┐
│ 📷 │
│ 🗜️ │
│ ✂️ │
│ 🔄 │
│    │
│ ▶  │ ← 展開按鈕
└────┘
```

#### 工具列表定義
```typescript
interface Tool {
  id: string;
  slug: string;
  name: { [locale: string]: string };
  icon: LucideIcon;
  available: boolean;
  comingSoon: boolean;
}

const TOOLS: Tool[] = [
  {
    id: 'removebg',
    slug: 'removebg',
    name: {
      'zh-tw': '去背',
      'en': 'Remove BG',
      'zh-cn': '去背',
      'ja': '背景削除'
    },
    icon: ImageMinus,
    available: true,
    comingSoon: false
  },
  {
    id: 'compress',
    slug: 'compress',
    name: {
      'zh-tw': '壓縮',
      'en': 'Compress',
      'zh-cn': '压缩',
      'ja': '圧縮'
    },
    icon: Minimize2,
    available: false,
    comingSoon: true
  },
  // ... crop, convert
];
```

#### 驗證規則

**拖動功能**:
- ✅ 工具可自由拖動到畫面任意位置
- ✅ 拖動時使用 GPU 加速（60fps）
- ✅ 拖動過程中顯示拖動狀態（opacity: 0.5）
- ✅ 拖動結束後自動儲存位置到 localStorage

**排序功能**:
- ✅ 工具可拖動排序
- ✅ 排序結果立即儲存到 localStorage
- ✅ 重新載入頁面後保持排序順序

**收合功能**:
- ✅ 點擊收合按鈕切換展開/收合狀態
- ✅ 收合狀態儲存到 localStorage
- ✅ 收合時寬度從 256px 變為 64px
- ✅ 展開時顯示完整工具名稱
- ✅ 收合時僅顯示 icon

**Active 狀態**:
- ✅ 當前工具必須高亮顯示
- ✅ 高亮樣式：背景色 + 邊框
- ✅ 根據 URL pathname 自動同步

**點擊行為**:
- ✅ 點擊工具 icon 跳轉到對應工具頁面
- ✅ URL 必須正確變更
- ✅ Available 工具：正常跳轉
- ✅ Coming Soon 工具：跳轉到 Coming Soon 404

**localStorage 持久化**:
- ✅ Key: `toolbar-storage`
- ✅ 儲存內容：工具順序 + 工具列位置 + 收合狀態
- ✅ 格式：JSON
- ✅ 失敗處理：使用預設值

---

### 1.6 移動端工具列規格（底部 Tab Bar）

#### 功能需求
- ✅ 底部固定（fixed bottom-0）
- ✅ 高度 64px (h-16)
- ✅ 顯示所有工具 icon
- ✅ 點擊跳轉到對應工具頁面
- ✅ 顯示當前工具的 Active 狀態
- ❌ 不可拖動（與桌面端不同）

#### 技術約束
- **位置**: `components/ToolBar/MobileTabBar.tsx`
- **顯示條件**: 僅在 `<768px` 時顯示
- **桌面端工具列**: `≥768px` 時隱藏 MobileTabBar，顯示 DesktopToolBar

#### UI 規格
```
┌───────────────────────────────────────────┐
│  [📷]    [🗜️]    [✂️]    [🔄]             │ ← 64px
│  去背    壓縮    裁切    轉換               │
└───────────────────────────────────────────┘
```

#### 驗證規則
- ✅ 移動端（<768px）：顯示 MobileTabBar，隱藏 DesktopToolBar
- ✅ 桌面端（≥768px）：隱藏 MobileTabBar，顯示 DesktopToolBar
- ✅ Tab Bar 必須固定在底部
- ✅ 高度必須為 64px
- ✅ 當前工具必須高亮顯示
- ✅ 點擊工具 icon 必須跳轉到對應頁面
- ✅ 不可拖動

---

### 1.7 響應式設計規格

#### 斷點定義
```typescript
const breakpoints = {
  sm: 640,   // 手機橫屏
  md: 768,   // 平板（工具列切換點）
  lg: 1024,  // 桌面
  xl: 1280,  // 大桌面
  '2xl': 1536, // 超大桌面
};
```

#### 佈局規格

**桌面端（≥768px）**:
```
高度分配：
- NavBar: 64px (fixed top)
- DesktopToolBar: calc(100vh - 64px) (fixed left)
- Main Content: calc(100vh - 64px) with ml-64 (or ml-16 if collapsed)

無 Scroll Bar 策略：
- 主內容區域：overflow-y: auto, scrollbar-width: none
- 工具列：overflow-y: auto, scrollbar-width: none
```

**移動端（<768px）**:
```
高度分配：
- NavBar: 64px (fixed top)
- Main Content: calc(100vh - 128px) (NavBar + TabBar)
- MobileTabBar: 64px (fixed bottom)

無 Scroll Bar 策略：
- 主內容區域：overflow-y: auto, scrollbar-width: none
- 使用 pb-16 避免內容被 TabBar 遮擋
```

#### 驗證規則
- ✅ 在 768px 斷點切換工具列顯示方式
- ✅ 桌面端不顯示 MobileTabBar
- ✅ 移動端不顯示 DesktopToolBar
- ✅ 主內容區域無不必要的滾動條
- ✅ 所有內容可正常顯示

---

### 1.8 語言切換功能規格

#### 要求
- ✅ 語言切換器位於 NavBar 右側
- ✅ 支援 4 種語言：zh-tw, en, zh-cn, ja
- ✅ 使用 Radix UI Select 組件
- ✅ 顯示語言旗幟 emoji + 語言名稱

#### UI 規格
```typescript
// 語言選項
const languages = [
  { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];
```

#### 切換行為
| 當前 URL | 選擇語言 | 切換後 URL |
|----------|---------|-----------|
| `/zh-tw/removebg` | en | `/en/removebg` |
| `/en/compress` | zh-cn | `/zh-cn/compress` |
| `/ja/crop` | zh-tw | `/zh-tw/crop` |

#### 驗證規則
- ✅ 語言切換後 URL 正確變更
- ✅ 頁面內容正確翻譯
- ✅ 保持在相同工具頁面
- ✅ localStorage 儲存語言偏好（可選）
- ✅ 切換流暢，無閃爍

---

## 2. 非功能性需求規格

### 2.1 性能需求

#### Core Web Vitals
| 指標 | 目標值 | 測量工具 |
|------|--------|---------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse |
| **FID** (First Input Delay) | < 100ms | Lighthouse |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse |

#### 其他性能指標
| 指標 | 目標值 | 測量工具 |
|------|--------|---------|
| **頁面切換速度** | < 500ms | Performance API |
| **工具列拖動 FPS** | ≥ 60fps | DevTools Performance |
| **Lighthouse Performance** | ≥ 90 | Lighthouse |
| **Bundle Size** | < 500KB (gzip) | webpack-bundle-analyzer |

#### 驗證規則
- ✅ 所有性能指標必須在 Dev 環境達標
- ✅ Lighthouse 審計必須在 Incognito 模式執行
- ✅ 測試至少 3 次取平均值
- ✅ 使用 Chrome 最新穩定版測試

---

### 2.2 SEO 需求規格

#### Meta Tags 規格

**每個工具頁面必須有獨立的 Meta Tags**:

```typescript
// 範例：RemoveBG 工具
{
  title: {
    'zh-tw': 'AI 去背工具 | CloudTools AI',
    'en': 'AI Background Remover | CloudTools AI',
    'zh-cn': 'AI 去背工具 | CloudTools AI',
    'ja': 'AI 背景削除ツール | CloudTools AI'
  },
  description: {
    'zh-tw': '免費線上 AI 去背工具，支援 JPG/PNG/WebP，瀏覽器本地處理，隱私安全。',
    'en': 'Free online AI background remover. Process JPG/PNG/WebP locally in browser. Privacy-first.',
    'zh-cn': '免费在线 AI 去背工具，支持 JPG/PNG/WebP，浏览器本地处理，隐私安全。',
    'ja': '無料オンライン AI 背景削除ツール。JPG/PNG/WebP 対応、ブラウザ処理、プライバシー保護。'
  },
  keywords: {
    'zh-tw': '去背, AI 去背, 圖片去背, 線上工具, 免費',
    'en': 'background remover, AI, image processing, online tool, free',
    'zh-cn': '去背, AI 去背, 图片去背, 在线工具, 免费',
    'ja': '背景削除, AI, 画像処理, オンラインツール, 無料'
  }
}
```

#### hreflang Tags 規格
```html
<link rel="alternate" hreflang="zh-tw" href="https://tools.cloudto.io/zh-tw/removebg" />
<link rel="alternate" hreflang="en" href="https://tools.cloudto.io/en/removebg" />
<link rel="alternate" hreflang="zh-cn" href="https://tools.cloudto.io/zh-cn/removebg" />
<link rel="alternate" hreflang="ja" href="https://tools.cloudto.io/ja/removebg" />
<link rel="alternate" hreflang="x-default" href="https://tools.cloudto.io/zh-tw/removebg" />
```

#### Structured Data 規格
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CloudTools AI",
  "url": "https://tools.cloudto.io",
  "description": "AI-powered image tools",
  "applicationCategory": "UtilityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "inLanguage": ["zh-TW", "en", "zh-CN", "ja"]
}
```

#### Lily SEO 驗證檢查清單

**必須檢查的項目**:

1. ✅ **Meta Tags** (所有語言版本)
   - Title 長度 50-60 字元
   - Description 長度 120-160 字元
   - Keywords 相關且不重複

2. ✅ **hreflang Tags**
   - 所有語言版本都有
   - URL 正確
   - x-default 指向預設語言

3. ✅ **Canonical Tags**
   - 每頁都有
   - 指向正確的 URL

4. ✅ **Open Graph Tags**
   - og:title, og:description, og:image
   - og:url, og:type, og:locale

5. ✅ **Twitter Card Tags**
   - twitter:card, twitter:title, twitter:description
   - twitter:image

6. ✅ **Structured Data**
   - 使用 Google Rich Results Test 驗證
   - 無錯誤和警告

7. ✅ **Core Web Vitals**
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

8. ✅ **Mobile-Friendly**
   - 通過 Google Mobile-Friendly Test

9. ✅ **Sitemap.xml**
   - 包含所有頁面
   - 正確的 lastmod 日期

10. ✅ **Robots.txt**
    - 允許索引主要頁面
    - 禁止索引 API 路由

#### SEO 驗證報告格式

```markdown
## SEO 驗證報告 - CloudTools AI 工具平台

**日期**: 2025-10-26
**驗證環境**: Dev (https://devtools.cloudto.io)
**驗證者**: Lily（SEO 工程師）

### 1. Meta Tags 檢查

#### zh-tw
- ✅ Title: "AI 去背工具 | CloudTools AI" (長度: 19 字元) ✅
- ✅ Description: "免費線上 AI 去背工具..." (長度: 45 字元) ✅
- ✅ Keywords: 包含相關關鍵字 ✅

#### en
- ✅ Title: "AI Background Remover | CloudTools AI" ✅
- ✅ Description: "Free online AI background remover..." ✅
- ✅ Keywords: 包含相關關鍵字 ✅

... (所有語言版本)

### 2. hreflang Tags
- ✅ zh-tw: 正確
- ✅ en: 正確
- ✅ zh-cn: 正確
- ✅ ja: 正確
- ✅ x-default: 正確

### 3. Structured Data
- ✅ Google Rich Results Test: 通過
- ✅ 無錯誤

### 4. Core Web Vitals
- ✅ LCP: 1.8s (目標 < 2.5s) ✅
- ✅ FID: 45ms (目標 < 100ms) ✅
- ✅ CLS: 0.05 (目標 < 0.1) ✅

### 5. Lighthouse SEO
- ✅ 分數: 95/100 (目標 ≥ 90) ✅

### 6. 問題與建議
無重大問題發現。

**整體評分**: ✅ 通過

**簽名**: Lily（SEO 工程師）
```

---

### 2.3 兼容性需求

#### 瀏覽器支援
| 瀏覽器 | 最低版本 | 測試優先級 |
|--------|---------|-----------|
| Chrome | 90+ | 高 |
| Edge | 90+ | 高 |
| Firefox | 89+ | 中 |
| Safari | 14.1+ | 中 |

#### 裝置支援
| 裝置類型 | 解析度範圍 | 測試優先級 |
|----------|-----------|-----------|
| Desktop | 1024px - 1920px | 高 |
| Tablet | 768px - 1024px | 中 |
| Mobile | 375px - 768px | 高 |

#### 驗證規則
- ✅ 所有支援的瀏覽器必須測試
- ✅ 所有裝置類型必須測試
- ✅ Critical 功能在所有環境都能正常使用

---

## 3. 測試需求規格

### 3.1 單元測試規格

#### 測試框架
- **框架**: Vitest 4.0.3
- **測試庫**: @testing-library/react 16.3.0
- **覆蓋率**: ≥ 80%

#### 必須測試的組件

**NavBar 組件**:
```typescript
describe('NavBar', () => {
  it('應該渲染 Logo 和品牌名稱', () => {});
  it('應該渲染語言切換器', () => {});
  it('應該正確處理語言切換', () => {});
  it('應該在桌面端顯示完整導航', () => {});
  it('應該在移動端簡化顯示', () => {});
});
```

**DesktopToolBar 組件**:
```typescript
describe('DesktopToolBar', () => {
  it('應該渲染所有工具 icon', () => {});
  it('應該正確處理工具排序', () => {});
  it('應該正確處理收合/展開', () => {});
  it('應該正確高亮當前工具', () => {});
  it('應該正確儲存到 localStorage', () => {});
  it('應該正確從 localStorage 載入', () => {});
});
```

**MobileTabBar 組件**:
```typescript
describe('MobileTabBar', () => {
  it('應該渲染所有工具 icon', () => {});
  it('應該正確高亮當前工具', () => {});
  it('應該正確處理工具切換', () => {});
  it('應該僅在移動端顯示', () => {});
});
```

**路由功能**:
```typescript
describe('路由功能', () => {
  it('首頁應該重定向到 /removebg', () => {});
  it('無效語言應該返回 404', () => {});
  it('Coming Soon 工具應該顯示 Coming Soon 404', () => {});
  it('無效工具應該返回標準 404', () => {});
});
```

#### 驗證規則
- ✅ 所有組件必須有單元測試
- ✅ 測試覆蓋率必須 ≥ 80%
- ✅ 所有測試必須通過（`npm run test`）
- ✅ 測試必須在 CI/CD 中自動執行

---

### 3.2 E2E 測試規格（Playwright MCP）

#### 測試場景

**場景 1: 完整 RemoveBG 流程**
```typescript
test('完整去背流程', async ({ page }) => {
  // 1. 訪問 RemoveBG 工具
  await page.goto('https://devtools.cloudto.io/zh-tw/removebg');

  // 2. 上傳圖片
  await page.setInputFiles('input[type="file"]', 'test-image.jpg');

  // 3. 等待處理完成
  await page.waitForSelector('.processed-image');

  // 4. 驗證結果顯示
  const resultImage = page.locator('.processed-image');
  await expect(resultImage).toBeVisible();

  // 5. 下載去背圖片
  const downloadBtn = page.locator('button:has-text("下載")');
  await downloadBtn.click();

  // 6. 驗證下載成功
  // ...
});
```

**場景 2: 語言切換**
```typescript
test('語言切換功能', async ({ page }) => {
  await page.goto('https://devtools.cloudto.io/zh-tw/removebg');

  // 點擊語言切換器
  await page.click('[data-testid="language-switcher"]');

  // 選擇英文
  await page.click('[data-value="en"]');

  // 驗證 URL 變更
  await expect(page).toHaveURL('https://devtools.cloudto.io/en/removebg');

  // 驗證頁面內容翻譯
  await expect(page.locator('h1')).toContainText('Background Remover');
});
```

**場景 3: 工具列拖放（桌面端）**
```typescript
test('工具列拖放功能', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://devtools.cloudto.io/zh-tw/removebg');

  // 拖動工具
  const tool1 = page.locator('[data-tool-id="removebg"]');
  const tool2 = page.locator('[data-tool-id="compress"]');
  await tool1.dragTo(tool2);

  // 驗證順序改變
  // ...

  // 重新載入頁面
  await page.reload();

  // 驗證順序保持（localStorage 持久化）
  // ...
});
```

**場景 4: 移動端 Tab Bar**
```typescript
test('移動端 Tab Bar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('https://devtools.cloudto.io/zh-tw/removebg');

  // 驗證 Tab Bar 顯示
  const tabBar = page.locator('[data-testid="mobile-tab-bar"]');
  await expect(tabBar).toBeVisible();

  // 驗證桌面工具列隱藏
  const desktopToolbar = page.locator('[data-testid="desktop-toolbar"]');
  await expect(desktopToolbar).not.toBeVisible();

  // 點擊工具切換
  await page.click('[data-tool-id="compress"]');
  await expect(page).toHaveURL('https://devtools.cloudto.io/zh-tw/compress');
});
```

#### 驗證規則
- ✅ 所有關鍵場景必須有 E2E 測試
- ✅ 測試必須在 Local 和 Dev 環境都執行
- ✅ 測試必須覆蓋所有瀏覽器（Chrome, Firefox, Safari）
- ✅ 測試必須覆蓋所有裝置類型（Desktop, Tablet, Mobile）
- ✅ 所有測試必須通過

---

### 3.3 跨瀏覽器測試規格

#### 測試矩陣

| 功能 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| 頁面載入 | ✅ | ✅ | ✅ | ✅ |
| 語言切換 | ✅ | ✅ | ✅ | ✅ |
| 工具列拖放 | ✅ | ✅ | ✅ | ✅ |
| 工具列收合 | ✅ | ✅ | ✅ | ✅ |
| RemoveBG 上傳 | ✅ | ✅ | ✅ | ✅ |
| RemoveBG 處理 | ✅ | ✅ | ✅ | ✅ |
| RemoveBG 下載 | ✅ | ✅ | ✅ | ✅ |
| 移動端 Tab Bar | ✅ | ✅ | ✅ | ✅ |

#### 驗證規則
- ✅ 所有功能在所有瀏覽器都必須正常
- ✅ 測試必須使用真實瀏覽器（非 headless）
- ✅ 發現 bug 立即記錄並分級
- ✅ Critical/High 等級 bug 必須修復

---

## 4. 部署需求規格

### 4.1 環境配置規格

#### Dev 環境
```bash
# VPS 配置
IP: 165.154.226.78
OS: Ubuntu 22.04 LTS
Node: 20 LTS
Port: 3000

# Cloudflare DNS
A Record: devtools.cloudto.io → 165.154.226.78
Proxy: ON (橙色雲朵)

# Nginx 配置
server {
    server_name devtools.cloudto.io;
    location / {
        proxy_pass http://localhost:3000;
    }
}

# PM2 配置
pm2 start npm --name "tools-dev" -- run dev

# Git 分支
develop
```

#### Prd 環境
```bash
# VPS 配置
IP: 165.154.226.78
OS: Ubuntu 22.04 LTS
Node: 20 LTS
Port: 3001

# Cloudflare DNS
A Record: tools.cloudto.io → 165.154.226.78
Proxy: ON (橙色雲朵)

# Nginx 配置
server {
    server_name tools.cloudto.io;
    location / {
        proxy_pass http://localhost:3001;
    }
}

# PM2 配置（cluster mode）
pm2 start npm --name "tools-prd" --instances max -- start

# Git 分支
master
```

#### 驗證規則
- ✅ DNS 解析正確（使用 `dig` 檢查）
- ✅ Nginx 配置正確（使用 `nginx -t` 檢查）
- ✅ PM2 進程正常運行（使用 `pm2 status` 檢查）
- ✅ 環境變數正確載入
- ✅ HTTPS 正常（Cloudflare SSL）

---

### 4.2 Git 工作流規格

#### 分支策略

```
develop (開發分支)
   ↓
   開發 → Local 測試 → 推送到 develop
   ↓
   自動部署到 Dev 環境 (devtools.cloudto.io)
   ↓
   QA 測試 + SEO 驗證
   ↓
   CTO 驗收
   ↓
   【等待 CTO 批准】 ← 關鍵檢查點
   ↓
   Merge to master
   ↓
   部署到 Prd 環境 (tools.cloudto.io)
```

#### Commit 規範（Conventional Commits）

**前端開發（Waylon）**:
```
feat(ui): 新增 NavBar 組件
feat(ui): 實現可拖動工具列
feat(ui): 實現移動端 Tab Bar
feat(routing): 實現動態路由 [locale]/[tool]
```

**後端開發（Costa）**:
```
feat(api): 新增 RemoveBG API endpoint
feat(api): 實現去背處理邏輯
```

**Bug 修復（Mark）**:
```
fix(ui): 修復工具列拖放問題
fix(routing): 修復 404 頁面路由
```

**DevOps（Louis）**:
```
infra(nginx): 配置 Dev 環境 Nginx
infra(pm2): 配置 PM2 cluster mode
deploy(dev): 部署到 Dev 環境
deploy(prd): 部署到 Prd 環境
```

**SEO（Lily）**:
```
seo(meta): 優化 Meta Tags
seo(schema): 新增 Structured Data
```

#### 驗證規則
- ✅ 所有 commit 必須遵循 Conventional Commits
- ✅ Commit message 必須清晰描述變更
- ✅ 每個 commit 必須包含相關測試
- ✅ 未經 CEO 批准不可 merge 到 master

---

## 5. 驗收標準（總表）

### 5.1 功能完整性檢查

| 功能 | 驗收標準 | 負責人 |
|------|---------|--------|
| **首頁重定向** | `/[locale]` → `/[locale]/removebg` | Waylon |
| **RemoveBG 功能** | 上傳 → 處理 → 下載流程正常 | Waylon + Costa |
| **工具列拖放** | 可拖動、可排序、位置持久化 | Waylon |
| **工具列收合** | 可收合/展開、狀態持久化 | Waylon |
| **移動端 Tab Bar** | 底部固定、工具切換正常 | Waylon |
| **語言切換** | 4 種語言切換正常 | Waylon |
| **Coming Soon 404** | 預留工具顯示 Coming Soon | Waylon |

### 5.2 測試覆蓋檢查

| 測試類型 | 驗收標準 | 負責人 |
|----------|---------|--------|
| **單元測試** | 覆蓋率 ≥ 80% | Waylon + Costa |
| **Local 測試** | 所有功能在 localhost:5173 正常 | Waylon + Costa |
| **Dev 測試** | 所有功能在 devtools.cloudto.io 正常 | Lucia + Ann |
| **E2E 測試** | 關鍵場景測試通過 | Lucia + Ann |
| **跨瀏覽器** | Chrome/Firefox/Safari 測試通過 | Lucia + Ann |
| **響應式** | Desktop/Tablet/Mobile 測試通過 | Lucia + Ann |
| **SEO 驗證** | Lighthouse SEO ≥ 90 | Lily |

### 5.3 性能指標檢查

| 指標 | 目標值 | 驗證工具 | 負責人 |
|------|--------|---------|--------|
| **LCP** | < 2.5s | Lighthouse | Lily |
| **FID** | < 100ms | Lighthouse | Lily |
| **CLS** | < 0.1 | Lighthouse | Lily |
| **Performance** | ≥ 90 | Lighthouse | Lily |
| **工具列拖動 FPS** | ≥ 60fps | DevTools | Waylon |

### 5.4 SEO 指標檢查

| 指標 | 驗收標準 | 負責人 |
|------|---------|--------|
| **Lighthouse SEO** | ≥ 90 | Lily |
| **Meta Tags** | 所有語言版本完整且正確 | Lily |
| **hreflang Tags** | 配置正確 | Lily |
| **Structured Data** | 無錯誤 | Lily |
| **Mobile-Friendly** | 通過測試 | Lily |
| **Sitemap.xml** | 包含所有頁面 | Lily |

### 5.5 代碼質量檢查

| 項目 | 驗收標準 | 負責人 |
|------|---------|--------|
| **TypeScript** | 無錯誤 | Waylon + Costa |
| **ESLint** | 無警告 | Waylon + Costa |
| **Code Review** | 通過 | Chris + Shawn |
| **Conventional Commits** | 所有 commit 符合規範 | 所有人 |

### 5.6 文檔完整性檢查

| 文檔 | 驗收標準 | 負責人 |
|------|---------|--------|
| **README.md** | 完整且準確 | Waylon |
| **API 文檔** | 完整且準確 | Costa |
| **技術文檔** | 更新完成 | Leo |
| **部署文檔** | 更新完成 | Louis |

### 5.7 部署就緒檢查

| 項目 | 驗收標準 | 負責人 |
|------|---------|--------|
| **Dev 部署** | devtools.cloudto.io 正常 | Louis |
| **環境變數** | Dev + Prd 配置正確 | Louis |
| **Cloudflare DNS** | devtools + tools 配置完成 | Louis |
| **PM2 進程** | Dev + Prd 進程正常 | Louis |
| **Nginx 配置** | Dev + Prd 配置正確 | Louis |
| **回滾機制** | 可用且已測試 | Louis |

---

## 6. 強制檢查點流程

### 6.1 開發階段檢查點

**Checkpoint 1: Local 測試通過**
- ✅ 開發者（Waylon/Costa）自測
- ✅ 單元測試通過
- ✅ 覆蓋率 ≥ 80%
- ✅ 功能在 localhost 正常

**CTO 確認**: 我會要求開發者提供測試報告

---

### 6.2 部署階段檢查點

**Checkpoint 2: Dev 環境部署**
- ✅ 代碼推送到 develop 分支
- ✅ Louis 部署到 devtools.cloudto.io
- ✅ Dev 環境正常運行

**CTO 確認**: 我會親自訪問 Dev 環境驗證

---

### 6.3 測試階段檢查點

**Checkpoint 3: QA 測試通過**
- ✅ Lucia/Ann 執行 E2E 測試
- ✅ 跨瀏覽器測試通過
- ✅ 響應式測試通過
- ✅ 無 Critical/High 等級 Bug

**CTO 確認**: 我會審查 QA 測試報告

---

**Checkpoint 4: SEO 驗證通過**
- ✅ Lily 執行 SEO 審計
- ✅ Lighthouse SEO ≥ 90
- ✅ Core Web Vitals 達標
- ✅ Meta Tags 完整
- ✅ hreflang Tags 正確

**CTO 確認**: 我會審查 Lily 的 SEO 驗證報告

---

### 6.4 驗收階段檢查點

**Checkpoint 5: CTO 最終驗收**
- ✅ 所有測試報告已審查
- ✅ Dev 環境功能驗證
- ✅ SEO 驗證結果確認
- ✅ 代碼質量審查
- ✅ 文檔完整性審查
- ✅ **做出最終批准決策**

**CTO 決策**: ✅ 批准 / ❌ 拒絕

---

**Checkpoint 6: 批准 Merge to Master**
- ✅ **僅在 CEO 明確批准後執行**
- ✅ CTO 驗收完成後提交 CEO 審批
- ✅ CEO 批准後通知 Louis 可以 merge
- ✅ Louis 執行 merge 操作
- ❌ 未經 CEO 批准絕對不可 merge

**CEO 控制**: CEO 會親自發出批准通知

---

**Checkpoint 7: Prd 環境部署**
- ✅ Louis 部署到 tools.cloudto.io
- ✅ Prd 環境正常運行
- ✅ 功能驗證通過

**CTO 驗證**: 我會親自訪問 Prd 環境驗證

---

## 7. 風險控制規格

### 7.1 代碼品質門檻

**不可妥協的標準**:
- ❌ TypeScript 錯誤 → **必須修復**
- ❌ ESLint 錯誤 → **必須修復**
- ❌ 測試覆蓋率 < 80% → **必須補足**
- ❌ Critical/High Bug → **必須修復**

### 7.2 測試門檻

**不可跳過的測試**:
- ❌ Local 測試 → **必須執行**
- ❌ Dev 環境測試 → **必須執行**
- ❌ SEO 驗證 → **必須執行**
- ❌ CTO 驗收 → **必須執行**

### 7.3 部署門檻

**不可跳過的檢查**:
- ❌ 未經測試 → **禁止部署**
- ❌ 未經 CTO 批准 → **禁止 merge to master**
- ❌ 環境變數缺失 → **禁止部署**
- ❌ Nginx 配置錯誤 → **禁止部署**

---

## 8. 緊急處理規格

### 8.1 發現 Critical Bug

**處理流程**:
1. QA 立即通知對應工程師（Waylon 或 Costa）
2. 工程師在 4 小時內修復
3. 重新執行所有測試
4. 重新提交 CTO 驗收

### 8.2 SEO 驗證未通過

**處理流程**:
1. Lily 提供詳細的 SEO 問題清單
2. Waylon 在 2 小時內修復
3. Lily 重新驗證
4. 通過後提交 CTO 驗收

### 8.3 CTO 驗收未通過

**處理流程**:
1. CTO 提供詳細的問題清單
2. 相關工程師在 1 天內修復
3. 重新執行所有測試
4. 重新提交 CTO 驗收

---

## 9. 交付物清單

### 9.1 代碼交付物

| 交付物 | 路徑 | 負責人 |
|--------|------|--------|
| **Next.js 應用** | `frontend/` | Waylon |
| **NavBar 組件** | `components/NavBar/` | Waylon |
| **工具列組件** | `components/ToolBar/` | Waylon |
| **RemoveBG 組件** | `components/RemoveBG/` | Waylon |
| **Zustand Stores** | `stores/` | Waylon |
| **工具定義** | `lib/constants/tools.ts` | Waylon |
| **API Routes** | `app/api/` | Costa |
| **單元測試** | `__tests__/` | Waylon + Costa |

### 9.2 配置交付物

| 交付物 | 路徑 | 負責人 |
|--------|------|--------|
| **Nginx 配置** | `/etc/nginx/sites-available/` | Louis |
| **PM2 配置** | `ecosystem.config.js` | Louis |
| **環境變數** | `.env.development`, `.env.production` | Louis |
| **Cloudflare DNS** | Cloudflare Dashboard | Louis |

### 9.3 測試交付物

| 交付物 | 路徑 | 負責人 |
|--------|------|--------|
| **QA 測試報告** | `docs/review/qa-test-report.md` | Lucia + Ann |
| **SEO 驗證報告** | `docs/review/seo-verification-report.md` | Lily |
| **CTO 驗收報告** | `docs/specs/cto-final-acceptance.md` | CTO |

### 9.4 文檔交付物

| 交付物 | 路徑 | 負責人 |
|--------|------|--------|
| **README.md** | 根目錄 | Waylon |
| **API 文檔** | `docs/api/` | Costa |
| **系統設計文檔** | `docs/architecture/system-design.md` | Leo |
| **技術棧文檔** | `docs/architecture/tech-stack.md` | Leo |
| **ADR 文檔** | `docs/architecture/adr/` | Leo |
| **部署文檔** | `docs/devops/deployment-guide.md` | Louis |

---

## 10. CTO 驗收檢查清單

### 10.1 功能驗收（7 項）

- [ ] 1. 首頁重定向正常（`/zh-tw` → `/zh-tw/removebg`）
- [ ] 2. RemoveBG 功能正常（上傳 → 處理 → 下載）
- [ ] 3. 工具列拖放功能正常（Desktop，可自由拖動）
- [ ] 4. 工具列收合功能正常（Desktop）
- [ ] 5. 移動端 Tab Bar 功能正常（底部固定，不可拖動）
- [ ] 6. 語言切換功能正常（4 種語言）
- [ ] 7. Coming Soon 404 頁面正常（compress, crop, convert）

### 10.2 測試驗收（6 項）

- [ ] 1. 單元測試覆蓋率 ≥ 80%
- [ ] 2. Local 測試通過（開發者報告）
- [ ] 3. Dev 環境測試通過（QA 報告）
- [ ] 4. E2E 測試通過（Playwright MCP）
- [ ] 5. 跨瀏覽器測試通過（Chrome, Firefox, Safari）
- [ ] 6. SEO 驗證通過（Lily 報告）

### 10.3 性能驗收（4 項）

- [ ] 1. Lighthouse Performance ≥ 90
- [ ] 2. LCP < 2.5s
- [ ] 3. FID < 100ms
- [ ] 4. CLS < 0.1

### 10.4 SEO 驗收（5 項）

- [ ] 1. Lighthouse SEO ≥ 90
- [ ] 2. Meta Tags 完整且正確（所有語言）
- [ ] 3. hreflang Tags 配置正確
- [ ] 4. Structured Data 無錯誤
- [ ] 5. Mobile-Friendly Test 通過

### 10.5 代碼品質驗收（4 項）

- [ ] 1. 無 TypeScript 錯誤
- [ ] 2. 無 ESLint 警告
- [ ] 3. Code Review 通過（Chris + Shawn）
- [ ] 4. 所有 Commit 遵循 Conventional Commits

### 10.6 文檔驗收（4 項）

- [ ] 1. README.md 完整
- [ ] 2. API 文檔完整
- [ ] 3. 技術文檔完整（Leo 更新）
- [ ] 4. 部署文檔完整（Louis 更新）

### 10.7 部署驗收（5 項）

- [ ] 1. Dev 環境部署成功（devtools.cloudto.io）
- [ ] 2. 環境變數配置正確（Dev + Prd）
- [ ] 3. Cloudflare DNS 配置完成（devtools + tools）
- [ ] 4. PM2 進程正常運行（Dev + Prd 配置完成）
- [ ] 5. Nginx 配置正確（Dev + Prd）

---

## 11. CTO 批准流程

### 11.1 批准條件

**只有當以下所有條件均滿足時，CEO 才批准 merge to master**:

1. ✅ 功能驗收（7/7 項通過）
2. ✅ 測試驗收（6/6 項通過）
3. ✅ 性能驗收（4/4 項通過）
4. ✅ SEO 驗收（5/5 項通過）
5. ✅ 代碼品質驗收（4/4 項通過）
6. ✅ 文檔驗收（4/4 項通過）
7. ✅ 部署驗收（5/5 項通過）

**總計**: 35 項檢查全部通過

### 11.2 批准通知

**CEO 批准後發送通知**:

```
致：Louis（DevOps 工程師）

主旨：批准 Merge to Master - CloudTools AI 工具平台

CTO 驗收已完成，CEO 已批准，所有驗收檢查已通過（35/35 項）：
- ✅ 功能完整性
- ✅ 測試覆蓋
- ✅ 性能指標
- ✅ SEO 指標
- ✅ 代碼品質
- ✅ 文檔完整
- ✅ 部署就緒

批准執行以下操作：
1. Merge develop 到 master
2. 部署到 Prd 環境（tools.cloudto.io）

請立即執行並回報部署結果。

簽名：CEO
日期：YYYY-MM-DD HH:MM
```

### 11.3 拒絕處理

**CTO 拒絕後的處理流程**:

1. CTO 提供詳細的問題清單
2. 相關工程師修復問題
3. 重新執行所有測試
4. 重新提交 CTO 驗收
5. 重複直到通過

---

## 12. 緊急回滾規格

### 12.1 回滾觸發條件

**任何以下情況發生時立即回滾**:
- ❌ Prd 環境出現 Critical Bug
- ❌ 性能指標嚴重下降（LCP > 5s）
- ❌ SEO 評分嚴重下降（< 50）
- ❌ 大量用戶反饋問題

### 12.2 回滾流程

```bash
# 1. 立即切換到上一個穩定版本
pm2 stop tools-prd

# 2. Git 回滾到上一個 commit
git checkout master
git reset --hard HEAD~1

# 3. 重新部署
npm install && npm run build
pm2 start tools-prd

# 4. 驗證
curl https://tools.cloudto.io/health
```

### 12.3 回滾後處理

1. 分析失敗原因
2. 修復問題
3. 重新執行所有測試
4. 重新提交 CTO 驗收

---

## 13. 附錄：測試數據

### 13.1 測試圖片

**提供以下測試圖片**:
- `test-small.jpg` (500x500px, < 100KB)
- `test-medium.jpg` (1024x1024px, < 500KB)
- `test-large.jpg` (2048x2048px, < 2MB)
- `test-portrait.png` (800x1200px)
- `test-landscape.png` (1200x800px)

### 13.2 測試瀏覽器版本

| 瀏覽器 | 版本 |
|--------|------|
| Chrome | 120+ |
| Firefox | 121+ |
| Safari | 17+ |
| Edge | 120+ |

### 13.3 測試裝置解析度

| 裝置類型 | 解析度 |
|----------|--------|
| Desktop | 1920x1080 |
| Laptop | 1366x768 |
| Tablet | 768x1024 |
| Mobile | 375x667 (iPhone SE) |
| Mobile | 414x896 (iPhone 11) |

---

**規格文檔結束**

**下一步**: CTO 委派任務給團隊成員，開始實施階段。
