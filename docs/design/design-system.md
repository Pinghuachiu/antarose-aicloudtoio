# 🎨 ai.cloudto.io 視覺設計系統規範

**版本：** v1.0
**設計師：** Lisa (UI/UX Designer)
**日期：** 2025-10-25
**專案：** AI 去背小幫手

---

## 一、設計理念與核心價值

### 1.1 設計定位

**「專業科技感 × 極簡高效 × 值得信賴」**

ai.cloudto.io 是一款強調**隱私、速度、專業**的 AI 工具，設計語言應體現：

- **🔬 科技專業感**：AI 與圖像處理的技術底蘊
- **⚡ 高效簡潔**：極簡介面，聚焦核心功能
- **🔒 安全可信**：傳達「本地處理、隱私保護」的信任感
- **🌊 流暢體驗**：微動效、漸變、柔和過渡

### 1.2 設計風格方向

**選定風格：Modern Tech Minimalism（現代科技極簡主義）**

**特徵：**
- ✅ 深色模式為主（夜間友善，專業科技感）
- ✅ 高對比度設計（提升視覺層次）
- ✅ 微妙漸變與光感（AI 科技感）
- ✅ 圓潤邊角（友善親和）
- ✅ 玻璃擬態效果（Glassmorphism）用於卡片層次
- ✅ 柔和陰影與模糊（景深層次）

**參考案例：**
- [Vercel](https://vercel.com/) - 極簡科技感、漸變運用
- [Linear](https://linear.app/) - 深色介面、高對比設計
- [Raycast](https://www.raycast.com/) - 玻璃擬態、精緻細節
- [Stripe](https://stripe.com/) - 專業可信、清晰層次

---

## 二、色彩系統設計

### 2.1 主色調定義（Dark Mode 優先）

#### 主色（Primary）：科技藍 - AI 智慧象徵

```javascript
// Tailwind 配置
primary: {
  50:  '#e0f2ff',  // 極淡藍（懸停提示）
  100: '#b9e1ff',  // 淡藍（次要元素）
  200: '#7cc6ff',  // 柔和藍（輔助按鈕）
  300: '#3da9ff',  // 明亮藍（強調文字）
  400: '#0e8dff',  // 標準藍（主要按鈕）
  500: '#0070f3',  // 主色調（品牌色）← 核心色
  600: '#005bc4',  // 深藍（按鈕懸停）
  700: '#004796',  // 更深藍（按鈕按下）
  800: '#003269',  // 暗藍（暗色文字）
  900: '#001d3d',  // 極暗藍（深色背景）
}
```

**使用場景：**
- 主要 CTA 按鈕（上傳、下載）
- 連結文字
- 進度條、加載動畫
- 重要圖示與標誌

---

#### 輔助色（Secondary）：專業紫 - 高端質感

```javascript
secondary: {
  50:  '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',  // 主輔助色 ← 核心色
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
}
```

**使用場景：**
- 次要按鈕（重新上傳）
- 標籤徽章
- 特殊狀態提示
- 付費功能區塊（未來）

---

#### 強調色（Accent）：活力橙 - 行動號召

```javascript
accent: {
  50:  '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',  // 主強調色 ← 核心色
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
}
```

**使用場景：**
- 關鍵 CTA（「立即去背」）
- 下載按鈕最終確認
- 重要通知提示
- 贊助按鈕

---

#### 中性色（Neutral）：專業灰階系統

```javascript
neutral: {
  50:  '#fafafa',  // 淺色模式背景
  100: '#f4f4f5',  // 淺色卡片
  200: '#e4e4e7',  // 分隔線
  300: '#d4d4d8',  // 邊框
  400: '#a1a1aa',  // 次要文字（淺色）
  500: '#71717a',  // 佔位文字
  600: '#52525b',  // 次要文字（深色）
  700: '#3f3f46',  // 主要文字（深色）
  800: '#27272a',  // 深色卡片背景
  850: '#1f1f23',  // 深色次要背景
  900: '#18181b',  // 深色主背景
  950: '#0a0a0b',  // 極深背景
}
```

**深色模式配色：**
- 背景：`neutral-900` / `neutral-950`
- 卡片：`neutral-800` / `neutral-850`
- 文字主色：`neutral-50` / `neutral-100`
- 文字次要：`neutral-400` / `neutral-500`

---

#### 語意色（Semantic Colors）

```javascript
// 成功 - 綠色
success: {
  500: '#10b981',
  600: '#059669',
}

// 警告 - 黃色
warning: {
  500: '#f59e0b',
  600: '#d97706',
}

// 錯誤 - 紅色
error: {
  500: '#ef4444',
  600: '#dc2626',
}

// 資訊 - 青色
info: {
  500: '#06b6d4',
  600: '#0891b2',
}
```

---

### 2.2 漸變系統（Gradient System）

#### 主要漸變（Primary Gradient）- 用於 Hero 區塊

```css
.gradient-primary {
  background: linear-gradient(135deg, #0070f3 0%, #8b5cf6 100%);
}
```

#### 玻璃擬態漸變（Glassmorphism）- 用於卡片

```css
.gradient-glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

#### 光暈效果（Glow Effect）- 用於懸停態

```css
.glow-primary {
  box-shadow: 0 0 20px rgba(0, 112, 243, 0.4);
}
```

---

### 2.3 色彩使用規範

| 元素 | 淺色模式 | 深色模式 | Tailwind Class |
|------|----------|----------|----------------|
| 頁面背景 | `neutral-50` | `neutral-900` | `bg-neutral-50 dark:bg-neutral-900` |
| 卡片背景 | `white` | `neutral-800` | `bg-white dark:bg-neutral-800` |
| 主要文字 | `neutral-900` | `neutral-50` | `text-neutral-900 dark:text-neutral-50` |
| 次要文字 | `neutral-600` | `neutral-400` | `text-neutral-600 dark:text-neutral-400` |
| 主要按鈕 | `primary-500` | `primary-500` | `bg-primary-500 hover:bg-primary-600` |
| 次要按鈕 | `neutral-200` | `neutral-700` | `bg-neutral-200 dark:bg-neutral-700` |
| 邊框 | `neutral-300` | `neutral-700` | `border-neutral-300 dark:border-neutral-700` |
| 分隔線 | `neutral-200` | `neutral-800` | `border-neutral-200 dark:border-neutral-800` |

---

## 三、字體系統設計（多語系支援）

### 3.1 多語系字體選擇策略

本專案支援 **4 種語言**：繁中、簡中、英文、日文。每種語言使用對應的優化字體。

#### 繁體中文字體（zh-tw）

**主字體：Noto Sans TC（Google Fonts）**
- ✅ 開源免費，商用無憂
- ✅ **授權：SIL Open Font License 1.1**
- ✅ **商用：完全免費，無需付費或授權**
- ✅ 支援繁體中文完整字庫
- ✅ 現代幾何設計，科技感強
- ✅ 多重字重（300, 400, 500, 700, 900）
- 📄 授權連結：<https://fonts.google.com/noto/specimen/Noto+Sans+TC/license>

**備選方案：**
- 系統字體降級：`system-ui`, `-apple-system`, `Microsoft JhengHei`

---

#### 简体中文字體（zh-cn）

**主字體：Noto Sans SC（Google Fonts）**
- ✅ 開源免費，商用無憂
- ✅ **授權：SIL Open Font License 1.1**
- ✅ **商用：完全免費，無需付費或授權**
- ✅ 支援簡體中文完整字庫
- ✅ 與 Noto Sans TC 同系列，視覺一致
- ✅ 多重字重（300, 400, 500, 700, 900）
- 📄 授權連結：<https://fonts.google.com/noto/specimen/Noto+Sans+SC/license>

**備選方案：**
- 系統字體降級：`system-ui`, `-apple-system`, `Microsoft YaHei`

---

#### English 字體（en）

**主字體：Inter（Google Fonts）**
- ✅ 開源免費，商用無憂
- ✅ **授權：SIL Open Font License 1.1**
- ✅ **商用：完全免費，無需付費或授權**
- ✅ 現代無襯線字體
- ✅ 數字等寬設計（適合顯示尺寸、進度）
- ✅ 優秀的螢幕可讀性
- ✅ Variable Font 支援
- 📄 授權連結：<https://fonts.google.com/specimen/Inter/license>

**備選方案：**
- 系統字體降級：`system-ui`, `-apple-system`, `Segoe UI`

---

#### 日本語字體（ja）

**主字體：Noto Sans JP（Google Fonts）**
- ✅ 開源免費，商用無憂
- ✅ **授權：SIL Open Font License 1.1**
- ✅ **商用：完全免費，無需付費或授權**
- ✅ 支援日文完整字庫（平假名、片假名、漢字）
- ✅ 與 Noto Sans TC/SC 同系列，視覺一致
- ✅ 多重字重（300, 400, 500, 700, 900）
- 📄 授權連結：<https://fonts.google.com/noto/specimen/Noto+Sans+JP/license>

**備選方案：**
- 系統字體降級：`system-ui`, `-apple-system`, `Hiragino Sans`

---

#### 程式碼字體（全語言共用）

**主字體：JetBrains Mono（Google Fonts）**
- ✅ 開源免費，商用無憂
- ✅ **授權：SIL Open Font License 1.1**
- ✅ **商用：完全免費，無需付費或授權**
- ✅ 用於技術說明、API 文件
- ✅ 等寬設計
- ✅ 優秀的程式碼可讀性
- 📄 授權連結：<https://fonts.google.com/specimen/JetBrains+Mono/license>

---

### ⚖️ 商用授權總結

**所有字體皆採用 SIL Open Font License 1.1，100% 可商用：**

| 字體 | 授權 | 商用 | 付費 | 署名要求 |
|------|------|------|------|----------|
| Noto Sans TC | OFL 1.1 | ✅ | ❌ 免費 | ❌ 不需要 |
| Noto Sans SC | OFL 1.1 | ✅ | ❌ 免費 | ❌ 不需要 |
| Inter | OFL 1.1 | ✅ | ❌ 免費 | ❌ 不需要 |
| Noto Sans JP | OFL 1.1 | ✅ | ❌ 免費 | ❌ 不需要 |
| JetBrains Mono | OFL 1.1 | ✅ | ❌ 免費 | ❌ 不需要 |

**✅ 結論：所有字體可安心用於商業專案，無需擔心授權問題。**

---

### 3.2 字體動態載入策略

**根據語言動態載入對應字體：**

```typescript
// app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import { Noto_Sans_TC } from 'next/font/google';
import { Noto_Sans_SC } from 'next/font/google';
import { Noto_Sans_JP } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

// 繁體中文
const notoSansTC = Noto_Sans_TC({
  subsets: ['chinese-traditional'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-tc',
});

// 简体中文
const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-sc',
});

// English
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
});

// 日本語
const notoSansJP = Noto_Sans_JP({
  subsets: ['japanese'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-jp',
});

// 程式碼字體
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-mono',
});

// 根據 locale 動態選擇主字體
const fontMap = {
  'zh-tw': notoSansTC.variable,
  'zh-cn': notoSansSC.variable,
  'en': inter.variable,
  'ja': notoSansJP.variable,
};

export default function LocaleLayout({ params: { locale } }) {
  return (
    <html lang={locale} className={`${fontMap[locale]} ${jetbrainsMono.variable}`}>
      <body>...</body>
    </html>
  );
}
```

**效能優化：**
- ✅ 僅載入當前語言的字體（減少初始載入）
- ✅ 使用 Next.js Font Optimization 自動優化
- ✅ `display: 'swap'` 避免 FOIT (Flash of Invisible Text)
- ✅ 預連接 Google Fonts CDN

---

### 3.2 字體層級系統

#### 標題層級（Headings）

```javascript
// Tailwind 配置
fontSize: {
  // Display - 超大標題（Hero 區）
  'display-1': ['3.5rem', { lineHeight: '1.1', fontWeight: '900', letterSpacing: '-0.02em' }],  // 56px
  'display-2': ['3rem', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.02em' }],    // 48px

  // Headings - 一般標題
  'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],  // 40px
  'h2': ['2rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' }],    // 32px
  'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0' }],        // 24px
  'h4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0' }],       // 20px
  'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0' }],      // 18px
  'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0' }],          // 16px
}
```

#### 內文層級（Body Text）

```javascript
fontSize: {
  // Body - 內文
  'body-xl': ['1.25rem', { lineHeight: '1.7', fontWeight: '400' }],  // 20px
  'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }], // 18px
  'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],        // 16px
  'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }], // 14px
  'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],  // 12px

  // Caption - 輔助文字
  'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500', color: 'neutral-600' }], // 14px
  'caption-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500', color: 'neutral-500' }], // 12px
}
```

---

### 3.3 字體使用規範

| 元素 | 字體層級 | 字重 | 使用場景 |
|------|----------|------|----------|
| Hero 主標 | `display-1` | 900 | 首頁大標「AI 去背小幫手」 |
| Hero 副標 | `body-xl` | 400 | 「免登入・不上傳・全程本機處理」 |
| 頁面標題 | `h1` | 700 | 各頁面主標題 |
| 區塊標題 | `h2` | 700 | 主要功能區塊標題 |
| 卡片標題 | `h3` | 600 | 上傳卡片、預覽卡片 |
| 按鈕文字 | `body` | 500 | 所有按鈕 |
| 內文 | `body` | 400 | 說明文字、段落 |
| 輔助說明 | `body-sm` | 400 | 檔案格式提示、系統需求 |
| 標籤徽章 | `caption` | 500 | 狀態標籤、功能標籤 |
| 版權資訊 | `caption-sm` | 400 | Footer 版權聲明 |

---

## 四、間距與排版系統

### 4.1 Tailwind Spacing Scale 規範

**基礎單位：4px（0.25rem）**

```javascript
// Tailwind 配置 - 使用預設 spacing，但定義語意化用途
spacing: {
  // 微間距（元素內部）
  'xs': '0.5rem',   // 8px  - 按鈕內邊距、圖示間距
  'sm': '0.75rem',  // 12px - 小卡片內邊距
  'md': '1rem',     // 16px - 標準內邊距
  'lg': '1.5rem',   // 24px - 大卡片內邊距
  'xl': '2rem',     // 32px - 區塊內邊距

  // 區塊間距（組件之間）
  'section-sm': '2.5rem',  // 40px - 小區塊間距
  'section': '3rem',       // 48px - 標準區塊間距
  'section-lg': '4rem',    // 64px - 大區塊間距
  'section-xl': '6rem',    // 96px - Hero 區間距
}
```

---

### 4.2 頁面佈局網格系統

#### Container 配置

```javascript
// Tailwind 配置
container: {
  center: true,
  padding: {
    DEFAULT: '1rem',   // 16px - 手機版
    sm: '2rem',        // 32px - 平板版
    lg: '4rem',        // 64px - 桌面版
    xl: '5rem',        // 80px - 大螢幕
    '2xl': '6rem',     // 96px - 超大螢幕
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}
```

---

### 4.3 響應式斷點策略

| 斷點 | 尺寸 | 裝置 | 佈局策略 |
|------|------|------|----------|
| `xs` | < 640px | 手機直立 | 單欄佈局，上下堆疊 |
| `sm` | ≥ 640px | 手機橫向 | 單欄佈局，增大間距 |
| `md` | ≥ 768px | 平板 | 兩欄佈局（預覽區） |
| `lg` | ≥ 1024px | 小桌面 | 兩欄佈局，標準間距 |
| `xl` | ≥ 1280px | 大桌面 | 兩欄佈局，最大寬度 |
| `2xl` | ≥ 1536px | 超大螢幕 | 兩欄佈局，置中顯示 |

**響應式設計原則：**
- ✅ Mobile First - 從小螢幕開始設計
- ✅ 手機版：垂直滾動，單欄佈局
- ✅ 平板版：預覽區改為左右分割
- ✅ 桌面版：最大化利用橫向空間

---

### 4.4 組件間距規範

```css
/* 標題與內文間距 */
.heading-to-body {
  @apply mb-4;  /* 16px */
}

/* 段落間距 */
.paragraph-spacing {
  @apply mb-6;  /* 24px */
}

/* 區塊間距 */
.section-spacing {
  @apply mb-section;  /* 48px */
}

/* 按鈕組間距 */
.button-group {
  @apply gap-3;  /* 12px */
}

/* 卡片內邊距 */
.card-padding {
  @apply p-6 sm:p-8;  /* 24px → 32px */
}
```

---

## 五、組件風格指導

### 5.1 shadcn/ui 客製化方向

**核心策略：保持 shadcn/ui 的語意化結構，客製化視覺風格**

#### Button 組件

```typescript
// components/ui/button.tsx - 樣式客製化
const buttonVariants = cva(
  // 基礎樣式
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // 主要按鈕 - 漸變背景 + 光暈效果
        default:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98]",

        // 次要按鈕 - 深色透明背景
        secondary:
          "bg-neutral-800/50 text-neutral-100 border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600",

        // 強調按鈕 - 橙色漸變
        accent:
          "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg hover:shadow-accent-500/50 hover:scale-[1.02]",

        // 輪廓按鈕
        outline:
          "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",

        // 幽靈按鈕
        ghost:
          "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-base rounded-xl",
        lg: "h-14 px-8 text-lg rounded-xl",
        xl: "h-16 px-10 text-xl rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

---

#### Card 組件 - 玻璃擬態設計

```typescript
// components/ui/card.tsx
const Card = ({ className, ...props }) => (
  <div
    className={cn(
      // 玻璃擬態基礎樣式
      "rounded-2xl bg-neutral-800/50 backdrop-blur-xl",
      "border border-neutral-700/50",
      "shadow-2xl shadow-black/20",
      // 懸停效果
      "hover:bg-neutral-800/60 hover:border-neutral-600/50",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 pb-4",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div
    className={cn("p-6 pt-4", className)}
    {...props}
  />
);
```

---

#### Input 組件

```typescript
// components/ui/input.tsx
const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        // 基礎樣式
        "flex h-12 w-full rounded-xl px-4",
        // 背景與邊框
        "bg-neutral-800/50 border border-neutral-700",
        "backdrop-blur-sm",
        // 文字樣式
        "text-neutral-100 placeholder:text-neutral-500",
        // 聚焦效果
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
        "focus:outline-none",
        // 過渡效果
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
};
```

---

### 5.2 自訂組件樣式範例

#### UploadCard - 上傳區塊

```tsx
// components/ui/UploadCard.tsx
export const UploadCard = () => {
  return (
    <Card className="group">
      <CardContent className="p-12">
        {/* 虛線邊框拖曳區 */}
        <div className="
          border-2 border-dashed border-neutral-700
          rounded-2xl p-16
          flex flex-col items-center justify-center
          transition-all duration-300
          group-hover:border-primary-500
          group-hover:bg-primary-500/5
        ">
          {/* 上傳圖示 - 漸變色 */}
          <div className="
            w-20 h-20 mb-6
            bg-gradient-to-br from-primary-500 to-secondary-500
            rounded-full flex items-center justify-center
            shadow-lg shadow-primary-500/30
          ">
            <Upload className="w-10 h-10 text-white" />
          </div>

          {/* 主標題 */}
          <h3 className="text-h3 text-neutral-100 mb-2">
            拖曳圖片到此處
          </h3>

          {/* 副標題 */}
          <p className="text-body-sm text-neutral-400 mb-6">
            或點擊選擇檔案（支援 JPG、PNG、WebP）
          </p>

          {/* 上傳按鈕 */}
          <Button variant="default" size="lg">
            選擇圖片
          </Button>

          {/* 檔案限制提示 */}
          <p className="text-caption text-neutral-500 mt-4">
            最大尺寸：2048 × 2048px
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

#### PreviewCanvas - 預覽畫布

```tsx
// components/ui/PreviewCanvas.tsx
export const PreviewCanvas = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-h3 text-neutral-100">
          預覽結果
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* 圖片對照滑桿容器 */}
        <div className="relative aspect-square bg-neutral-900">
          {/* 原圖層 */}
          <div className="absolute inset-0">
            <img
              src="/original.jpg"
              alt="原圖"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 去背圖層 */}
          <div
            className="absolute inset-0 overflow-hidden transition-all duration-75"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          >
            <img
              src="/result.png"
              alt="去背結果"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 拖曳滑桿 */}
          <div className="
            absolute top-0 bottom-0 left-1/2
            w-1 bg-primary-500
            shadow-[0_0_10px_rgba(0,112,243,0.8)]
            cursor-ew-resize
          ">
            {/* 滑桿圓點 */}
            <div className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-10 h-10 rounded-full
              bg-primary-500 border-4 border-white
              shadow-lg
            "/>
          </div>
        </div>

        {/* 下載按鈕組 */}
        <div className="p-6 flex gap-3">
          <Button variant="default" size="lg" className="flex-1">
            下載 PNG（透明背景）
          </Button>
          <Button variant="secondary" size="lg" className="flex-1">
            下載 JPG（白底）
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

### 5.3 動畫與過渡效果建議

#### 微動效原則

```css
/* 標準過渡時間 */
.transition-standard {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 懸停縮放 */
.hover-scale {
  @apply transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98];
}

/* 載入動畫 - 脈衝效果 */
@keyframes pulse-glow {
  0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(0, 112, 243, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 40px rgba(0, 112, 243, 0.8); }
}

.loading-pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* 進度條動畫 */
@keyframes progress-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.progress-bar {
  background: linear-gradient(
    90deg,
    #0070f3 0%,
    #8b5cf6 50%,
    #0070f3 100%
  );
  background-size: 200% 100%;
  animation: progress-shimmer 2s linear infinite;
}
```

---

## 六、視覺層次與專業感營造

### 6.1 陰影系統（Shadow System）

```javascript
// Tailwind 配置
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',

  // 深色模式專用 - 更深的陰影
  'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  'dark-md': '0 12px 20px -4px rgba(0, 0, 0, 0.4)',
  'dark-lg': '0 25px 35px -8px rgba(0, 0, 0, 0.5)',

  // 光暈陰影
  'glow-primary': '0 0 20px rgba(0, 112, 243, 0.4)',
  'glow-accent': '0 0 20px rgba(249, 115, 22, 0.4)',
}
```

**使用規範：**
- 卡片：`shadow-dark-md`
- 懸停卡片：`shadow-dark-lg`
- 主要按鈕：`shadow-lg` + `hover:shadow-glow-primary`
- 強調按鈕：`shadow-lg` + `hover:shadow-glow-accent`
- 浮動元素（Modal、Dropdown）：`shadow-2xl`

---

### 6.2 圓角系統（Border Radius）

```javascript
// Tailwind 配置
borderRadius: {
  'none': '0',
  'sm': '0.375rem',   // 6px - 小標籤
  'md': '0.5rem',     // 8px - 輸入框
  'lg': '0.75rem',    // 12px - 小按鈕
  'xl': '1rem',       // 16px - 標準按鈕、卡片
  '2xl': '1.25rem',   // 20px - 大卡片
  '3xl': '1.5rem',    // 24px - Hero 卡片
  'full': '9999px',   // 圓形
}
```

**使用規範：**
- 按鈕：`rounded-xl` (16px)
- 卡片：`rounded-2xl` (20px)
- 輸入框：`rounded-xl` (16px)
- 圖片：`rounded-2xl` (20px)
- 徽章：`rounded-full`

---

### 6.3 邊框與分隔線

```css
/* 標準邊框 */
.border-standard {
  @apply border border-neutral-700/50;
}

/* 玻璃擬態邊框 */
.border-glass {
  @apply border border-white/10;
}

/* 發光邊框 */
.border-glow {
  @apply border border-primary-500 shadow-glow-primary;
}

/* 分隔線 */
.divider {
  @apply border-t border-neutral-800;
}
```

---

### 6.4 Glassmorphism vs Flat 風格選擇

**最終選擇：Glassmorphism（玻璃擬態）**

**理由：**
- ✅ 符合現代科技感設計趨勢
- ✅ 提升視覺層次感與景深
- ✅ 深色模式下效果更佳
- ✅ 與漸變、光暈效果完美結合

**應用場景：**
- 主要卡片（上傳、預覽）
- Modal 彈窗
- Dropdown 下拉選單
- Tooltip 提示框

**實作範例：**
```css
.glass-card {
  background: rgba(39, 39, 42, 0.5);  /* neutral-800/50 */
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 七、Tailwind 配置檔案完整範例

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // 主色調
        primary: {
          50: '#e0f2ff',
          100: '#b9e1ff',
          200: '#7cc6ff',
          300: '#3da9ff',
          400: '#0e8dff',
          500: '#0070f3',
          600: '#005bc4',
          700: '#004796',
          800: '#003269',
          900: '#001d3d',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        // 輔助色
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // 強調色
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // 中性色
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1f1f23',
          900: '#18181b',
          950: '#0a0a0b',
        },

        // 語意色
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          500: '#06b6d4',
          600: '#0891b2',
        },
      },

      fontSize: {
        // Display
        'display-1': ['3.5rem', { lineHeight: '1.1', fontWeight: '900', letterSpacing: '-0.02em' }],
        'display-2': ['3rem', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.02em' }],

        // Headings
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],

        // Body
        'body-xl': ['1.25rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Caption
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'caption-sm': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },

      spacing: {
        'xs': '0.5rem',
        'sm': '0.75rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        'section-sm': '2.5rem',
        'section': '3rem',
        'section-lg': '4rem',
        'section-xl': '6rem',
      },

      borderRadius: {
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },

      boxShadow: {
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 12px 20px -4px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 25px 35px -8px rgba(0, 0, 0, 0.5)',
        'glow-primary': '0 0 20px rgba(0, 112, 243, 0.4)',
        'glow-accent': '0 0 20px rgba(249, 115, 22, 0.4)',
      },

      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0070f3 0%, #8b5cf6 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },

      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 112, 243, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(0, 112, 243, 0.8)' },
        },
        'progress-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'progress-shimmer': 'progress-shimmer 2s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 八、全域 CSS 樣式

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 210 100% 50%;
    --primary-foreground: 0 0% 98%;
    --secondary: 265 89% 78%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 24 95% 53%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 210 100% 50%;
    --radius: 1rem;
  }

  .dark {
    --background: 240 10% 9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 12%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 12%;
    --popover-foreground: 0 0% 98%;
    --primary: 210 100% 50%;
    --primary-foreground: 0 0% 98%;
    --secondary: 265 89% 78%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 24 95% 53%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 24%;
    --input: 240 3.7% 24%;
    --ring: 210 100% 50%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-neutral-900 text-neutral-50 antialiased;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  /* 自訂捲軸（深色） */
  ::-webkit-scrollbar {
    @apply w-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-neutral-900;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-neutral-700 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-neutral-600;
  }
}

@layer components {
  /* 玻璃擬態卡片 */
  .glass-card {
    @apply bg-neutral-800/50 backdrop-blur-xl border border-neutral-700/50 rounded-2xl shadow-dark-md;
  }

  /* 漸變文字 */
  .gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500;
  }

  /* 發光效果 */
  .glow-effect {
    @apply shadow-glow-primary;
  }
}

@layer utilities {
  /* 文字截斷 */
  .text-truncate {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
  }

  .text-truncate-2 {
    @apply overflow-hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
```

---

## 九、設計資產與輸出規範

### 9.1 Logo 與品牌識別

**Logo 設計建議：**
- 主視覺：AI 圖示 + 品牌名稱「去背小幫手」
- 色彩：Primary Blue (#0070f3) + Gradient
- 字體：Noto Sans TC Bold

**輸出規格：**
```
/public/brand/
├── logo.svg              # 標準 Logo（深色背景）
├── logo-light.svg        # 淺色 Logo（淺色背景）
├── logo-icon.svg         # 純圖示
├── favicon.ico           # 網站圖示 (32x32)
└── og-image.png          # Open Graph 分享圖 (1200x630)
```

---

### 9.2 圖示系統

**使用 Lucide React（已包含在技術棧）**

**常用圖示對應：**
```typescript
import {
  Upload,        // 上傳
  Download,      // 下載
  Image,         // 圖片
  Sparkles,      // AI 效果
  Loader2,       // 載入動畫
  CheckCircle,   // 成功
  XCircle,       // 錯誤
  AlertCircle,   // 警告
  Info,          // 資訊
  Settings,      // 設定
  Palette,       // 背景選擇
  RefreshCw,     // 重新上傳
} from 'lucide-react'
```

**圖示使用規範：**
- 標準尺寸：`w-6 h-6` (24px)
- 按鈕圖示：`w-5 h-5` (20px)
- 小圖示：`w-4 h-4` (16px)
- 顏色：繼承父層或使用語意色

---

### 9.3 插圖與視覺元素

**Hero 區背景：**
- 漸變網格背景
- 動態光點效果（CSS animation）
- 模糊圖層增加景深

**空狀態插圖：**
- 使用簡約線條插圖
- 建議工具：[unDraw](https://undraw.co/)、[Storyset](https://storyset.com/)
- 色彩：Primary Blue + Neutral Gray

---

## 十、無障礙設計（Accessibility）

### 10.1 WCAG 2.1 AA 級標準遵循

**色彩對比度：**
- 正文文字（16px）：至少 4.5:1
- 大文字（18px+）：至少 3:1
- UI 組件：至少 3:1

**驗證工具：**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Lighthouse

---

### 10.2 鍵盤導航支援

```typescript
// 確保所有互動元素可透過鍵盤操作
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  aria-label="上傳圖片"
>
  上傳圖片
</Button>
```

---

### 10.3 螢幕閱讀器支援

```tsx
// 使用語意化 HTML 與 ARIA 屬性
<div role="region" aria-labelledby="upload-heading">
  <h2 id="upload-heading" className="sr-only">
    圖片上傳區
  </h2>

  <input
    type="file"
    aria-label="選擇要去背的圖片檔案"
    aria-describedby="file-constraints"
  />

  <p id="file-constraints" className="text-caption text-neutral-500">
    支援 JPG、PNG、WebP 格式，最大 2048x2048px
  </p>
</div>
```

---

## 十一、響應式設計細節

### 11.1 手機版特殊處理

**上傳區：**
- 減少內邊距（`p-6` → `p-4`）
- 按鈕改為全寬（`w-full`）
- 圖示縮小（`w-16 h-16` → `w-12 h-12`）

**預覽區：**
- 單欄垂直排列
- 按鈕組改為堆疊（`flex-col gap-3`）

**字體縮放：**
```css
/* 手機版縮小 */
@media (max-width: 640px) {
  .text-display-1 {
    font-size: 2.5rem; /* 從 3.5rem 縮小 */
  }
}
```

---

### 11.2 平板版優化

- 兩欄佈局（左上傳、右預覽）
- 間距調整（`gap-6`）
- 按鈕組橫向排列

---

## 十二、性能優化設計建議

### 12.1 圖片優化

```typescript
// Next.js Image 組件使用
import Image from 'next/image'

<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  width={1920}
  height={1080}
  quality={85}
  priority  // LCP 優化
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

### 12.2 字體載入優化

```typescript
// app/layout.tsx
import { Noto_Sans_TC, Inter } from 'next/font/google'

const notoSansTC = Noto_Sans_TC({
  subsets: ['chinese-traditional'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans-tc',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} ${inter.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

---

### 12.3 CSS 優化

- 使用 Tailwind JIT 模式（按需生成）
- PurgeCSS 移除未使用樣式
- 避免過度使用 `@apply`（影響 JIT 性能）

---

## 十三、設計交付清單

### 13.1 設計師交付物（Lisa 負責）

- [x] 設計系統規範文件（本文件）
- [ ] Figma 設計稿（主要頁面 Wireframe）
- [ ] Logo 與品牌資產（SVG、PNG）
- [ ] 色彩系統 Figma Library
- [ ] 組件庫 Figma Components
- [ ] 原型互動流程（Prototype）
- [ ] 設計走查檢查清單（Design QA Checklist）

---

### 13.2 前端工程師實作清單（Waylon 負責）

- [ ] 配置 `tailwind.config.ts`
- [ ] 建立 `globals.css`
- [ ] 客製化 shadcn/ui 組件樣式
- [ ] 實作 UploadCard 組件
- [ ] 實作 PreviewCanvas 組件
- [ ] 實作 Button variants
- [ ] 實作 Card 玻璃擬態效果
- [ ] 整合 Noto Sans TC 字體
- [ ] 實作響應式斷點
- [ ] 無障礙 ARIA 屬性
- [ ] 深色模式支援
- [ ] 性能優化（字體、圖片）

---

### 13.3 QA 驗證清單（Lucia / Ann 負責）

- [ ] 色彩對比度符合 WCAG AA 標準
- [ ] 所有按鈕支援鍵盤導航
- [ ] 螢幕閱讀器正確朗讀
- [ ] 手機版排版正常（iOS Safari / Chrome Android）
- [ ] 平板版兩欄佈局正確
- [ ] 桌面版最大寬度限制生效
- [ ] 所有動畫流暢（60fps）
- [ ] 字體載入無閃爍（FOUT/FOIT）
- [ ] 圖片懶載入正常
- [ ] 深色模式切換正常

---

## 十四、設計系統維護與演進

### 14.1 版本控制

**設計系統版本：**
- v1.0 - 初始版本（深色模式、玻璃擬態、科技藍配色）
- v1.1 - 淺色模式支援（未來）
- v2.0 - 設計改版（根據用戶反饋）

---

### 14.2 設計 Token 管理

**建議使用 CSS Variables 管理設計 Token：**

```css
:root {
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;

  /* Colors */
  --color-primary-500: #0070f3;
  --color-neutral-900: #18181b;

  /* Typography */
  --font-size-h1: 2.5rem;
  --line-height-h1: 1.2;
}
```

**優勢：**
- 動態主題切換
- 易於維護與更新
- 與 Tailwind 無縫整合

---

## 十五、參考資源與工具

### 15.1 設計參考

- [Vercel Design System](https://vercel.com/design)
- [Linear Design](https://linear.app/)
- [Raycast](https://www.raycast.com/)
- [Stripe](https://stripe.com/)
- [shadcn/ui Examples](https://ui.shadcn.com/examples)

---

### 15.2 設計工具

- **Figma** - UI 設計與原型
- **Coolors** - 色彩配色生成
- **WebAIM Contrast Checker** - 對比度檢查
- **Google Fonts** - 字體選擇
- **unDraw / Storyset** - 插圖資源

---

### 15.3 開發工具

- **Tailwind CSS IntelliSense** (VS Code)
- **Headwind** - Tailwind class 排序
- **Prettier Plugin Tailwind** - 格式化
- **Chrome DevTools** - 響應式測試
- **Lighthouse** - 性能與無障礙檢測

---

## 附錄：快速啟動指令

### A. 安裝依賴

```bash
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install next@15.1.6 react@19.0.0 react-dom@19.0.0
```

---

### B. 初始化 shadcn/ui

```bash
npx shadcn@latest init
```

**選項配置：**
```
✔ Would you like to use TypeScript? … yes
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … app/globals.css
✔ Would you like to use CSS variables for colors? … yes
✔ Are you using a custom tailwind prefix? … no
✔ Where is your tailwind.config.ts located? … tailwind.config.ts
✔ Configure the import alias for components: … @/components
✔ Configure the import alias for utils: … @/lib/utils
```

---

### C. 安裝常用組件

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add progress
npx shadcn@latest add toast
npx shadcn@latest add dialog
```

---

## 結語

本設計系統規範為 **ai.cloudto.io AI 去背小幫手** 量身打造，融合了**現代科技感、專業信賴感與高效使用體驗**。

**核心設計原則：**
1. **深色優先** - 科技感與夜間友善
2. **玻璃擬態** - 精緻層次與視覺深度
3. **漸變光暈** - AI 智慧感的視覺語言
4. **極簡高效** - 聚焦核心功能，減少干擾
5. **無障礙設計** - 符合 WCAG AA 標準

**下一步行動：**
1. Lisa 建立 Figma 設計稿與組件庫
2. Waylon 實作前端樣式系統
3. Lucia/Ann 執行設計走查與無障礙測試
4. CTO 最終驗收與品質把關

**設計系統是活文件，將隨專案演進持續優化。**

---

**文件版本：** v1.0
**最後更新：** 2025-10-25
**維護者：** Lisa (UI/UX Designer)
**審核者：** CTO

---

📧 如有設計相關問題或建議，請聯繫 Lisa 進行討論。
