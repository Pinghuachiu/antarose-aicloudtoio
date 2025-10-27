# OpenSpec Design: TinyWow 風格淺色主題技術設計

**專案名稱**: tools.cloudto.io 視覺主題重構
**設計文檔版本**: 1.0.0
**建立日期**: 2025-10-28
**設計師**: CTO
**狀態**: ✅ 設計完成，待實施

---

## 一、架構設計

### 1.1 整體架構變更

**現有架構：**
```
┌─────────────────────────────────────┐
│ NavBar (頂部，Logo + 語言切換)      │
├──────┬──────────────────────────────┤
│      │                              │
│ Tool │  Main Content               │
│ Bar  │  (上傳、預覽等)              │
│ (側  │                              │
│  邊) │                              │
│      │                              │
└──────┴──────────────────────────────┘
```

**目標架構：**
```
┌─────────────────────────────────────┐
│ TopNavigation (Logo + 工具 + 語言)  │
├─────────────────────────────────────┤
│                                     │
│        Main Content (居中)          │
│        (上傳、預覽等)                │
│                                     │
└─────────────────────────────────────┘
```

### 1.2 組件層級結構

```typescript
app/[locale]/layout.tsx
├── TopNavigation (新組件)
│   ├── Logo
│   ├── ToolsMenu (新組件)
│   │   ├── 去背
│   │   ├── 壓縮
│   │   ├── 裁切
│   │   └── 轉換
│   └── LanguageSelector
└── Main Content
    └── {children} (各工具頁面)
```

---

## 二、技術實施設計

### 2.1 Tailwind 配置更新

**檔案：** `frontend/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TinyWow 風格主色調
        primary: {
          DEFAULT: '#1A8FE3',
          hover: '#1570BD',
          light: '#E0F2FE',
        },
        // 文字顏色
        text: {
          primary: '#020817',
          heading: '#181D20',
          secondary: '#6B7280', // 改進後的輔助文字色（符合 WCAG AA）
          disabled: '#9CA3AF',
        },
        // 背景顏色
        background: {
          main: '#FFFFFF',
          secondary: '#F6F6F6',
          hover: '#F9FAFB',
        },
        // 邊框顏色
        border: {
          DEFAULT: '#D1D5DB',
          hover: '#9CA3AF',
          focus: '#1A8FE3',
        },
        // 語義色彩
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'nav': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 6px rgba(26, 143, 227, 0.2)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 2.2 全局樣式更新

**檔案：** `frontend/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 淺色主題色彩變數 */
    --background: 0 0% 100%; /* White */
    --foreground: 222 47% 11%; /* Text Dark */

    --primary: 203 91% 49%; /* #1A8FE3 */
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 96%; /* Light Gray */
    --secondary-foreground: 222 47% 11%;

    --muted: 0 0% 96%;
    --muted-foreground: 215 16% 47%;

    --accent: 203 91% 49%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 214 14% 83%; /* #D1D5DB */
    --input: 214 14% 83%;
    --ring: 203 91% 49%;

    --radius: 0.5rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  /* 移除玻璃擬態效果 */

  /* 虛線邊框樣式 */
  .dashed-upload-border {
    border: 2px dashed #D1D5DB;
    border-radius: 8px;
  }

  .dashed-upload-border:hover {
    border-color: #1A8FE3;
    background-color: #F0F9FF;
  }
}
```

### 2.3 Layout 組件重構

**檔案：** `frontend/app/[locale]/layout.tsx`

```typescript
import { TopNavigation } from '@/components/NavBar/TopNavigation';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="bg-white text-text-primary font-sans antialiased">
        {/* 頂部導航 */}
        <TopNavigation locale={locale} />

        {/* 主要內容區域 */}
        <main className="pt-20">
          {/* pt-20 為導航欄高度預留空間 */}
          {children}
        </main>

        <Toaster />
      </body>
    </html>
  );
}
```

---

## 三、組件設計

### 3.1 TopNavigation 組件（新增）

**檔案：** `frontend/components/NavBar/TopNavigation.tsx`

**設計規格：**
- 固定頂部：`fixed top-0 left-0 right-0 z-50`
- 背景：白色 + 淡陰影
- 高度：64px (Desktop) / 56px (Mobile)
- 內容佈局：Logo（左）+ 工具選單（中）+ 語言切換（右）

**技術實現：**

```typescript
import Link from 'next/link';
import { LanguageSelector } from './LanguageSelector';
import { ToolsMenu } from './ToolsMenu';

export function TopNavigation({ locale }: { locale: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-text-heading">CloudTools</span>
              <span className="text-primary"> AI</span>
            </div>
          </Link>

          {/* 工具選單（Desktop） */}
          <div className="hidden md:block">
            <ToolsMenu locale={locale} />
          </div>

          {/* 語言切換 */}
          <div className="flex items-center gap-4">
            <LanguageSelector currentLocale={locale} />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 3.2 ToolsMenu 組件（新增）

**檔案：** `frontend/components/NavBar/ToolsMenu.tsx`

```typescript
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS_LIST } from '@/lib/constants/tools';

export function ToolsMenu({ locale }: { locale: string }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {TOOLS_LIST.map((tool) => {
        const isActive = pathname.includes(`/${tool.id}`);

        return (
          <Link
            key={tool.id}
            href={`/${locale}/${tool.id}`}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${isActive
                ? 'bg-primary text-white'
                : 'text-text-primary hover:bg-background-hover'
              }
            `}
          >
            {tool.name[locale]}
          </Link>
        );
      })}
    </div>
  );
}
```

### 3.3 UploadCard 組件重設計

**檔案：** `frontend/components/features/upload-card.tsx`

**變更重點：**
- 移除玻璃擬態（`backdrop-blur-xl`）
- 改為虛線邊框（`border-2 border-dashed`）
- 白色背景
- 藍色實心按鈕

**技術實現：**

```typescript
export function UploadCard({ onFileSelect, disabled }: UploadCardProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: MAX_FILE_SIZE,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden rounded-lg
        border-2 border-dashed border-border
        bg-white
        transition-all duration-200
        ${isDragActive ? 'border-primary bg-primary-light' : 'hover:border-primary hover:bg-background-hover'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center py-16 px-6">
        {/* 圖示 */}
        <div className="mb-6 p-6 bg-primary/10 rounded-full">
          <Upload className="w-12 h-12 text-primary" />
        </div>

        {/* 主標題 */}
        <h3 className="text-2xl font-semibold text-text-heading mb-2">
          拖曳圖片到這裡
        </h3>

        {/* 分隔 */}
        <p className="text-base text-text-secondary mb-6">或</p>

        {/* 按鈕 */}
        <button
          type="button"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-button transition-colors"
        >
          選擇檔案
        </button>

        {/* 提示文字 */}
        <div className="mt-6 text-sm text-text-secondary space-y-1">
          <p>支援格式：JPG、PNG、WebP</p>
          <p>最大尺寸：2048 x 2048 px</p>
        </div>
      </div>
    </div>
  );
}
```

### 3.4 Button 組件更新

**檔案：** `frontend/components/ui/button.tsx`

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // 主要按鈕：實心藍色
        default: "bg-primary text-white hover:bg-primary-hover shadow-button",

        // 次要按鈕：白色 + 藍框
        outline: "bg-white border-2 border-primary text-primary hover:bg-primary-light",

        // 幽靈按鈕：透明
        ghost: "hover:bg-background-hover text-text-primary",

        // 危險按鈕
        destructive: "bg-error text-white hover:bg-error/90",
      },
      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## 四、資料庫/狀態管理變更

### 4.1 移除 ToolbarStore

**檔案：** `frontend/stores/toolbarStore.ts`

**理由：** 側邊欄移除後，不再需要工具列狀態管理（展開/收合）

**影響：**
- 移除 Zustand store
- 移除相關的 hook 使用

### 4.2 導航狀態

頂部導航為靜態設計，不需要狀態管理。工具切換直接使用 Next.js 路由。

---

## 五、API/數據流變更

### 5.1 無 API 變更

此次為純前端 UI 改造，不涉及：
- ❌ 後端 API 變更
- ❌ 資料結構變更
- ❌ 業務邏輯變更

### 5.2 保持現有功能

- ✅ 圖片上傳處理流程不變
- ✅ AI 去背功能不變
- ✅ IndexedDB 儲存不變
- ✅ 多語言切換不變

---

## 六、性能優化設計

### 6.1 CSS 優化

**移除的效果：**
- 玻璃擬態（`backdrop-blur-xl`）- 減少 GPU 負擔
- 複雜漸變背景 - 簡化渲染
- 深色模式切換 - 簡化 CSS 規則

**預期效果：**
- Lighthouse 評分提升 2-5 分
- 首次繪製時間減少 50-100ms

### 6.2 組件懶加載

保持現有的 dynamic import 策略，無需變更。

---

## 七、無障礙設計

### 7.1 對比度改進

根據 Lisa 的驗證報告：

**需要調整的配色：**

| 原始配色 | 對比度 | 狀態 | 調整後配色 | 新對比度 | 狀態 |
|---------|--------|------|-----------|---------|------|
| 次要按鈕（藍字/白底）| 3.5:1 | ⚠️ | `#1570BD` / 白底 | 4.2:1 | ✅ |
| 輔助文字（淺灰）| 2.8:1 | ❌ | `#6B7280` / 白底 | 5.3:1 | ✅ |

**實施：**
- 次要按鈕文字改用 `#1570BD`（primary-hover）
- 輔助文字改用 `#6B7280`（text-secondary）

### 7.2 鍵盤導航

- 頂部導航支援 Tab 鍵切換
- 工具選單支援方向鍵導航
- 上傳區域支援 Enter/Space 觸發

---

## 八、響應式設計實施

### 8.1 斷點策略

```typescript
// Tailwind 斷點
sm: '640px'   // 小型手機
md: '768px'   // 平板
lg: '1024px'  // 筆電
xl: '1280px'  // 桌機
2xl: '1536px' // 大螢幕
```

### 8.2 TopNavigation 響應式

**Mobile (< 768px):**
```typescript
<nav className="h-14">  {/* 較矮 */}
  <Logo />
  <HamburgerMenu />  {/* 顯示漢堡選單 */}
  <LanguageSelector />
</nav>
```

**Desktop (≥ 768px):**
```typescript
<nav className="h-16">  {/* 較高 */}
  <Logo />
  <ToolsMenu />  {/* 顯示完整工具選單 */}
  <LanguageSelector />
</nav>
```

### 8.3 上傳區域響應式

```typescript
<UploadCard className="
  py-12 sm:py-16    // Mobile 較小 padding
  px-4 sm:px-6      // Mobile 較小側邊距
">
  <Icon className="w-10 h-10 sm:w-12 sm:h-12" />  // Mobile 較小圖示
  <Button className="w-full sm:w-auto" />  // Mobile 全寬按鈕
</UploadCard>
```

---

## 九、遷移計畫

### 9.1 檔案變更清單

**新增檔案（3 個）：**
1. `components/NavBar/TopNavigation.tsx` - 頂部導航主組件
2. `components/NavBar/ToolsMenu.tsx` - 工具選單組件
3. `components/NavBar/HamburgerMenu.tsx` - Mobile 漢堡選單

**修改檔案（10+ 個）：**
1. `tailwind.config.ts` - 色彩系統配置
2. `app/globals.css` - 全局樣式
3. `app/[locale]/layout.tsx` - 佈局架構
4. `components/ui/button.tsx` - 按鈕變體
5. `components/ui/card.tsx` - 卡片樣式
6. `components/ui/input.tsx` - 輸入框樣式
7. `components/features/upload-card.tsx` - 虛線邊框設計
8. `components/features/upload-section.tsx` - 佈局調整
9. `components/features/preview-canvas.tsx` - 樣式更新
10. `app/[locale]/[tool]/page.tsx` - 頁面樣式

**移除檔案（2 個）：**
1. `components/ToolBar/DesktopToolBar.tsx` - 側邊欄組件
2. `stores/toolbarStore.ts` - 工具列狀態管理

**移除導入（多個檔案）：**
- 移除所有檔案中的 `import { useToolbarStore }`
- 移除 DesktopToolBar 組件引用

### 9.2 Git 提交策略

**Commit 順序：**

1. `feat(theme): 更新 Tailwind 配置為淺色主題`
2. `feat(theme): 更新全局樣式和 CSS 變數`
3. `feat(nav): 實作頂部導航組件`
4. `feat(nav): 移除側邊欄和工具列狀態管理`
5. `feat(ui): 更新 Button 組件樣式`
6. `feat(ui): 更新 Card 和 Input 組件`
7. `feat(upload): 重設計上傳卡片（虛線邊框）`
8. `feat(theme): 更新預覽和其他組件樣式`
9. `docs(theme): 更新設計系統文檔`

---

## 十、測試計畫

### 10.1 視覺回歸測試

使用 Playwright 截圖對比：

**測試頁面：**
1. `/zh-tw/removebg` - 去背工具
2. `/zh-tw/compress` - 壓縮工具
3. `/zh-tw/crop` - 裁切工具
4. `/zh-tw/convert` - 轉換工具

**測試斷點：**
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

### 10.2 功能測試

**核心功能：**
- [ ] 工具切換正常
- [ ] 語言切換正常
- [ ] 圖片上傳正常
- [ ] AI 處理正常
- [ ] 圖片下載正常
- [ ] IndexedDB 儲存正常

**導航測試：**
- [ ] 頂部導航固定正常
- [ ] 工具選單 hover 效果正確
- [ ] Mobile 漢堡選單展開/收合正常
- [ ] 路由切換平滑

### 10.3 無障礙測試

- [ ] 鍵盤 Tab 順序正確
- [ ] 所有按鈕可 keyboard 觸發
- [ ] aria-label 正確設定
- [ ] 對比度測試通過（WebAIM Contrast Checker）

---

## 十一、風險與對策

### 11.1 技術風險

| 風險 | 等級 | 影響 | 對策 |
|------|------|------|------|
| 移除側邊欄後佈局錯位 | 🟡 低 | Mobile 佈局可能需調整 | 完整的響應式測試 |
| 色彩對比度不足 | 🟡 低 | 某些文字可能難以閱讀 | 已提供改進方案 |
| CSS 變數遺漏 | 🟢 極低 | 某些組件可能未更新 | 全局搜索舊變數名 |

### 11.2 用戶體驗風險

| 風險 | 等級 | 影響 | 對策 |
|------|------|------|------|
| 用戶不適應淺色主題 | 🟠 中 | 可能導致跳出率增加 | 未來考慮 Dark Mode 切換 |
| 導航方式改變 | 🟠 中 | 需要重新學習 | 保持工具分類邏輯一致 |

---

## 十二、後續優化方向

### 12.1 Phase 2 功能（未來）

1. **Dark Mode 切換**
   - 加入主題切換按鈕
   - 支援系統主題偵測
   - LocalStorage 儲存偏好

2. **進階動畫**
   - Page transition 動畫
   - 工具切換動畫
   - 按鈕 ripple 效果

3. **更多互動細節**
   - Tooltip 提示
   - Loading skeleton
   - 進度條動畫

---

## 十三、CTO 審查檢查清單

### 13.1 設計完整性
- [x] 色彩系統完整定義
- [x] 字體系統規範清晰
- [x] 間距系統統一
- [x] 組件規格詳細
- [x] 響應式策略明確

### 13.2 技術可行性
- [x] Tailwind 配置合理
- [x] 組件實現可行
- [x] 無 Breaking Changes
- [x] 性能影響可控

### 13.3 無障礙合規
- [x] 對比度驗證完成
- [x] 改進方案明確
- [x] 鍵盤導航設計

---

## 十四、CTO 審批區

**審批結果**：✅ **批准**

**審批意見**：

技術設計完整且可行。架構變更清晰、組件實現詳細、性能優化得當、無障礙設計符合標準。批准進入下一階段。

**審批簽名**：CTO

**審批日期**：2025-10-28

---

**✅ 設計已批准，進入 Task Breakdown Phase。**
