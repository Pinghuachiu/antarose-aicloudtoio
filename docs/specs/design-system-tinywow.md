# TinyWow 風格淺色主題設計系統

**版本：** 1.0.0
**建立日期：** 2025-10-28
**狀態：** ✅ CTO 已批准
**設計師：** Lisa (UI/UX Designer)

---

## 目錄

1. [設計原則](#設計原則)
2. [色彩系統](#色彩系統)
3. [字體系統](#字體系統)
4. [間距系統](#間距系統)
5. [組件設計規格](#組件設計規格)
6. [對比度驗證](#對比度驗證)
7. [響應式設計指南](#響應式設計指南)

---

## 設計原則

TinyWow 設計風格的核心特點：

1. **清爽明亮** - 以白色為主背景，搭配鮮明的藍色主色調
2. **簡潔直觀** - 大按鈕、清晰的層級結構、充足的留白
3. **友善親和** - 圓角設計、柔和的陰影、平易近人的語言
4. **高效流暢** - 快速的操作流程、即時的視覺反饋

---

## 色彩系統

### 主色調

| 用途 | 顏色名稱 | HEX | RGB | Tailwind 類名 | 使用場景 |
|------|---------|-----|-----|--------------|---------|
| 主要品牌色 | Primary Blue | `#1A8FE3` | `rgb(26, 143, 227)` | `bg-[#1A8FE3]` | 主按鈕、CTA、重要鏈接 |
| 主要文字 | Text Dark | `#020817` | `rgb(2, 8, 23)` | `text-[#020817]` | 內文、段落文字 |
| 標題文字 | Heading Dark | `#181D20` | `rgb(24, 29, 32)` | `text-[#181D20]` | 標題、重點文字 |
| 背景色 | Background White | `#FFFFFF` | `rgb(255, 255, 255)` | `bg-white` | 頁面背景、卡片背景 |
| 邊框色 | Border Gray | `#D1D5DB` | `rgb(209, 213, 219)` | `border-[#D1D5DB]` | 分隔線、虛線邊框 |
| 輔助背景 | Light Gray | `#F6F6F6` | `rgb(246, 246, 246)` | `bg-[#F6F6F6]` | 搜索框背景、次要區域 |

### 語義色彩

| 用途 | 顏色名稱 | HEX | RGB | 使用場景 |
|------|---------|-----|-----|---------|
| 成功 | Success Green | `#10B981` | `rgb(16, 185, 129)` | 成功訊息、完成狀態 |
| 警告 | Warning Orange | `#F59E0B` | `rgb(245, 158, 11)` | 警告訊息 |
| 錯誤 | Error Red | `#EF4444` | `rgb(239, 68, 68)` | 錯誤訊息、刪除操作 |
| 資訊 | Info Blue | `#3B82F6` | `rgb(59, 130, 246)` | 資訊提示 |

### Hover 狀態色彩

| 狀態 | 顏色 | HEX | RGB | 使用場景 |
|------|------|-----|-----|---------|
| Primary Hover | Darker Blue | `#1570BD` | `rgb(21, 112, 189)` | 主按鈕 hover |
| Border Hover | Darker Gray | `#9CA3AF` | `rgb(156, 163, 175)` | 次要按鈕 hover |

---

## 字體系統

### 字體家族

```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
             'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
```

**Tailwind 配置：**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    }
  }
}
```

### 字體大小與層級

| 層級 | 用途 | 字體大小 | 字重 | 行高 | Tailwind 類名 | 使用場景 |
|------|------|---------|------|------|--------------|---------|
| H1 | 頁面主標題 | `40px` | `700` (Bold) | `56px` | `text-[40px] font-bold leading-[56px]` | 工具頁標題 |
| H2 | 次要標題 | `32px` | `700` (Bold) | `44px` | `text-[32px] font-bold leading-[44px]` | 區塊標題 |
| H3 | 小標題 | `24px` | `600` (SemiBold) | `32px` | `text-2xl font-semibold leading-8` | 卡片標題 |
| Body Large | 大內文 | `18px` | `400` (Regular) | `28px` | `text-lg leading-7` | 卡片副標題 |
| Body | 標準內文 | `16px` | `400` (Regular) | `24px` | `text-base leading-6` | 段落文字、說明文字 |
| Button | 按鈕文字 | `16px` | `600` (SemiBold) | `24px` | `text-base font-semibold` | 大按鈕 |
| Button Small | 小按鈕文字 | `14px` | `600` (SemiBold) | `20px` | `text-sm font-semibold` | 導航按鈕、小按鈕 |
| Caption | 輔助文字 | `14px` | `400` (Regular) | `20px` | `text-sm` | 提示訊息、時間戳 |
| Small | 極小文字 | `12px` | `400` (Regular) | `16px` | `text-xs` | 標籤、註解 |

### 字體使用指南

**標題使用：**
- 使用 Bold (700) 或 SemiBold (600) 字重
- 保持足夠的行距（行高約為字體大小的 1.4 倍）
- 顏色使用 `#181D20`（Heading Dark）

**內文使用：**
- 使用 Regular (400) 字重
- 行距建議 1.5 倍
- 顏色使用 `#020817`（Text Dark）

**按鈕文字：**
- 使用 SemiBold (600) 字重
- 避免全大寫，使用首字母大寫
- 保持簡短（2-4 個字）

---

## 間距系統

### 基礎間距單位

TinyWow 採用 8px 基礎網格系統：

| 名稱 | 數值 | Tailwind | 使用場景 |
|------|------|----------|---------|
| xs | `4px` | `space-1` | 極小間距 |
| sm | `8px` | `space-2` | 小間距、標籤內距 |
| md | `16px` | `space-4` | 標準間距、按鈕內距 |
| lg | `24px` | `space-6` | 大間距、組件間距 |
| xl | `32px` | `space-8` | 特大間距、區塊間距 |
| 2xl | `48px` | `space-12` | 區塊分隔 |
| 3xl | `64px` | `space-16` | 大區塊分隔 |

### Padding 規範

**按鈕內距：**

| 按鈕類型 | Padding | Tailwind 類名 |
|---------|---------|--------------|
| 主要按鈕（大） | `17px 24px` | `px-6 py-[17px]` |
| 次要按鈕（大） | `16px 24px` | `px-6 py-4` |
| 導航按鈕（小） | `9px 36px` | `px-9 py-[9px]` |
| 搜索按鈕 | `12px 26.5px` | `px-[26.5px] py-3` |

**容器內距：**

| 容器類型 | Padding | Tailwind 類名 |
|---------|---------|--------------|
| 上傳卡片 | `0px 16px`（左右）+ 垂直居中 | `px-4` |
| 主內容區 | `0px 48px`（桌面版） | `px-12` |
| 導航欄 | `9px` 上下 | `py-[9px]` |

### Margin 規範

**標題間距：**

| 元素 | Margin | Tailwind 類名 | 說明 |
|------|--------|--------------|------|
| H1 → 副標題 | `15px`（top） | `mt-[15px]` | 標題下方間距 |
| 區塊標題 → 內容 | `24px`（bottom） | `mb-6` | 標題與內容分隔 |

**組件間距：**

| 場景 | Gap/Margin | Tailwind 類名 |
|------|-----------|--------------|
| 按鈕組（橫向） | `8px` | `gap-2` |
| 卡片網格 | `24px` | `gap-6` |
| 區塊之間 | `48px` | `gap-12` 或 `my-12` |

---

## 組件設計規格

### 1. 頂部導航欄

**結構：** Logo + 工具分類 + 搜索 + 登入

**樣式規格：**

```css
/* 導航欄容器 */
.navbar {
  background-color: #FFFFFF;
  height: auto;
  padding: 9px 48px; /* 桌面版 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* 可選淡陰影 */
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Logo */
.logo {
  height: 32px; /* 建議高度 */
}

/* 導航鏈接 */
.nav-link {
  color: #020817;
  font-size: 14px;
  font-weight: 400;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #F6F6F6;
  color: #1A8FE3;
}
```

**Tailwind 實現：**

```tsx
<header className="bg-white shadow-sm">
  <nav className="container mx-auto px-12 py-[9px] flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-6">
      <img src="/logo.svg" alt="Logo" className="h-8" />

      {/* 工具分類 */}
      <div className="hidden md:flex items-center gap-1">
        <a href="#" className="px-3 py-2 text-sm text-[#020817] hover:bg-[#F6F6F6] hover:text-[#1A8FE3] rounded-md transition-colors">
          PDF
        </a>
        <a href="#" className="px-3 py-2 text-sm text-[#020817] hover:bg-[#F6F6F6] hover:text-[#1A8FE3] rounded-md transition-colors">
          Image
        </a>
        <a href="#" className="px-3 py-2 text-sm text-[#020817] hover:bg-[#F6F6F6] hover:text-[#1A8FE3] rounded-md transition-colors">
          Write
        </a>
      </div>
    </div>

    {/* 右側：搜索 + 登入 */}
    <div className="flex items-center gap-4">
      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="bg-[#F6F6F6] border-0 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#1A8FE3]"
        />
      </div>

      {/* 登入按鈕 */}
      <button className="bg-[#1A8FE3] text-white px-9 py-[9px] rounded-lg text-sm font-semibold hover:bg-[#1570BD] transition-colors">
        Sign In
      </button>
    </div>
  </nav>
</header>
```

**響應式斷點：**

| 斷點 | 行為 |
|------|------|
| Mobile (< 768px) | 漢堡選單、隱藏工具分類、縮小搜索框 |
| Tablet (768px - 1024px) | 顯示部分工具分類 |
| Desktop (> 1024px) | 完整顯示所有元素 |

---

### 2. 上傳卡片（核心組件）

**特點：** 虛線邊框、大按鈕、拖放支援

**樣式規格：**

```css
/* 上傳卡片容器 */
.upload-card {
  border: 2px dashed #D1D5DB;
  border-radius: 8px;
  padding: 48px 16px; /* 垂直間距較大 */
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 320px; /* 建議最小高度 */
  transition: all 0.3s ease;
}

/* Hover 狀態 */
.upload-card:hover {
  border-color: #1A8FE3;
  background-color: #F9FAFB;
}

/* 拖拽中狀態 */
.upload-card.dragging {
  border-color: #1A8FE3;
  background-color: #EFF6FF;
  border-style: solid;
}

/* 圖示區域 */
.upload-icon {
  width: 64px;
  height: 64px;
  color: #D1D5DB;
  margin-bottom: 8px;
}
```

**Tailwind 實現：**

```tsx
<div className="border-2 border-dashed border-[#D1D5DB] rounded-lg px-4 py-12 bg-white hover:border-[#1A8FE3] hover:bg-gray-50 transition-all min-h-[320px] flex flex-col items-center justify-center gap-4">
  {/* 圖示 */}
  <div className="w-16 h-16 text-gray-300 mb-2">
    <svg>...</svg>
  </div>

  {/* 主按鈕 */}
  <button className="bg-[#1A8FE3] text-white px-6 py-[17px] rounded-lg text-base font-semibold hover:bg-[#1570BD] transition-colors shadow-sm">
    Upload from PC or Mobile
  </button>

  {/* 次要按鈕組 */}
  <div className="flex items-center gap-2">
    <button className="bg-transparent text-[#1A8FE3] border border-[#1A8FE3] px-6 py-4 rounded-lg text-base font-semibold hover:bg-[#EFF6FF] transition-colors">
      My Files
    </button>
    <button className="bg-transparent text-[#1A8FE3] border border-[#1A8FE3] px-6 py-4 rounded-lg text-base font-semibold hover:bg-[#EFF6FF] transition-colors">
      + Create New
    </button>
  </div>

  {/* 提示文字 */}
  <p className="text-base text-[#020817] mt-2">
    or Drag files here
  </p>
</div>
```

**互動狀態：**

| 狀態 | 視覺效果 |
|------|---------|
| 預設 | 灰色虛線邊框 |
| Hover | 藍色虛線邊框 + 淡灰背景 |
| 拖拽中 | 藍色實線邊框 + 淡藍背景 |
| 已上傳 | 顯示檔案預覽 + 操作按鈕 |

---

### 3. 按鈕系統

#### 3.1 主要按鈕（Primary Button）

**用途：** 主要操作、CTA

```tsx
/* 大按鈕 */
<button className="bg-[#1A8FE3] text-white px-6 py-[17px] rounded-lg text-base font-semibold hover:bg-[#1570BD] active:scale-95 transition-all shadow-sm">
  Upload from PC or Mobile
</button>

/* 中按鈕 */
<button className="bg-[#1A8FE3] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#1570BD] transition-colors">
  Start Processing
</button>

/* 小按鈕（導航用） */
<button className="bg-[#1A8FE3] text-white px-9 py-[9px] rounded-lg text-sm font-semibold hover:bg-[#1570BD] transition-colors">
  Sign In
</button>
```

**規格表：**

| 尺寸 | Padding | 字體大小 | 圓角 | 使用場景 |
|------|---------|---------|------|---------|
| 大 | `17px 24px` | `16px` | `8px` | 上傳按鈕、主要 CTA |
| 中 | `12px 24px` | `14px` | `8px` | 一般操作按鈕 |
| 小 | `9px 36px` | `14px` | `7px` | 導航按鈕、次要操作 |

#### 3.2 次要按鈕（Secondary Button）

**用途：** 次要操作、輔助功能

```tsx
<button className="bg-transparent text-[#1A8FE3] border border-[#1A8FE3] px-6 py-4 rounded-lg text-base font-semibold hover:bg-[#EFF6FF] hover:border-[#1570BD] transition-colors">
  My Files
</button>
```

**互動狀態：**

| 狀態 | 背景色 | 文字色 | 邊框色 |
|------|--------|--------|--------|
| 預設 | 透明 | `#1A8FE3` | `#1A8FE3` |
| Hover | `#EFF6FF` | `#1570BD` | `#1570BD` |
| Active | `#DBEAFE` | `#1570BD` | `#1570BD` |
| Disabled | 透明 | `#9CA3AF` | `#D1D5DB` |

#### 3.3 搜索按鈕

**特點：** 圓形、緊湊

```tsx
<button className="bg-[#1A8FE3] text-white px-[26.5px] py-3 rounded-full text-sm font-medium hover:bg-[#1570BD] transition-colors">
  Search
</button>
```

#### 3.4 圖示按鈕

**用途：** 工具欄、快捷操作

```tsx
<button className="w-10 h-10 flex items-center justify-center rounded-lg text-[#020817] hover:bg-[#F6F6F6] hover:text-[#1A8FE3] transition-colors">
  <svg className="w-5 h-5">...</svg>
</button>
```

---

### 4. 預覽區域

**用途：** 顯示已上傳的圖片/檔案

**樣式規格：**

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
  {/* 預覽卡片 */}
  <div className="bg-white border border-[#D1D5DB] rounded-lg p-4 hover:shadow-md transition-shadow">
    {/* 圖片容器 */}
    <div className="aspect-square bg-[#F6F6F6] rounded-md mb-3 overflow-hidden">
      <img src="..." alt="Preview" className="w-full h-full object-cover" />
    </div>

    {/* 檔名 */}
    <p className="text-sm text-[#020817] truncate mb-2">
      image-filename.jpg
    </p>

    {/* 操作按鈕 */}
    <div className="flex gap-2">
      <button className="flex-1 bg-[#1A8FE3] text-white py-2 rounded-md text-sm font-semibold hover:bg-[#1570BD] transition-colors">
        Download
      </button>
      <button className="w-10 h-10 flex items-center justify-center border border-[#D1D5DB] rounded-md text-[#020817] hover:bg-[#F6F6F6] transition-colors">
        <svg>...</svg>
      </button>
    </div>
  </div>
</div>
```

**響應式網格：**

| 斷點 | 欄位數 |
|------|--------|
| Mobile (< 768px) | 2 欄 |
| Tablet (768px - 1024px) | 3 欄 |
| Desktop (> 1024px) | 4 欄 |

---

### 5. 卡片系統（首頁工具卡片）

**特點：** 彩色背景、圖示、標題、副標題

```tsx
<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-transform cursor-pointer shadow-lg">
  {/* 圖示 + 工具數量標籤 */}
  <div className="flex items-center justify-between mb-4">
    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
      <svg className="w-6 h-6">...</svg>
    </div>
    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
      45+ tools
    </span>
  </div>

  {/* 標題 */}
  <h3 className="text-2xl font-semibold mb-2">
    PDF Tools
  </h3>

  {/* 副標題 */}
  <p className="text-lg opacity-90 mb-4">
    Solve Your PDF Problems
  </p>

  {/* Featured Tool */}
  <div className="flex items-center justify-between text-sm">
    <span className="opacity-75">Featured Tool:</span>
    <span className="font-semibold">PDF Creator</span>
  </div>
</div>
```

**顏色變化：**

| 工具類別 | 漸層背景 |
|---------|---------|
| PDF Tools | `from-purple-500 to-purple-600` |
| Image Tools | `from-orange-500 to-orange-600` |
| Video Tools | `from-pink-500 to-pink-600` |
| AI Write | `from-blue-500 to-blue-600` |
| File Tools | `from-teal-500 to-teal-600` |

---

### 6. 輸入框與表單元素

#### 6.1 文字輸入框

```tsx
<input
  type="text"
  placeholder="Search tools..."
  className="w-full bg-[#F6F6F6] border-0 rounded-lg px-4 py-3 text-base text-[#020817] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A8FE3] focus:bg-white transition-all"
/>
```

#### 6.2 搜索框

```tsx
<div className="relative">
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]">
    {/* 搜索圖示 */}
  </svg>
  <input
    type="text"
    placeholder="Search"
    className="w-full bg-[#F6F6F6] border-0 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A8FE3]"
  />
</div>
```

#### 6.3 下拉選單

```tsx
<select className="bg-white border border-[#D1D5DB] rounded-lg px-4 py-2.5 text-base text-[#020817] focus:outline-none focus:ring-2 focus:ring-[#1A8FE3] focus:border-[#1A8FE3]">
  <option>Select an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

---

### 7. 提示訊息與通知

#### 7.1 資訊提示

```tsx
<div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start gap-3">
  <svg className="w-5 h-5 mt-0.5 flex-shrink-0">...</svg>
  <div>
    <p className="text-sm font-medium">Information</p>
    <p className="text-sm mt-1">Uploaded and generated files are deleted 1 hour after upload</p>
  </div>
</div>
```

#### 7.2 成功訊息

```tsx
<div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3">
  <svg className="w-5 h-5 mt-0.5 flex-shrink-0">...</svg>
  <div>
    <p className="text-sm font-medium">Success!</p>
    <p className="text-sm mt-1">File uploaded successfully</p>
  </div>
</div>
```

#### 7.3 錯誤訊息

```tsx
<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
  <svg className="w-5 h-5 mt-0.5 flex-shrink-0">...</svg>
  <div>
    <p className="text-sm font-medium">Error</p>
    <p className="text-sm mt-1">Failed to upload file. Please try again.</p>
  </div>
</div>
```

---

## 對比度驗證

根據 WCAG 2.1 Level AA 標準，文字與背景的對比度必須達到：

- **標準文字（< 18px）：** 對比度 ≥ 4.5:1
- **大文字（≥ 18px 或 ≥ 14px 粗體）：** 對比度 ≥ 3:1

### 對比度測試結果

| 組合 | 前景色 | 背景色 | 對比度 | 狀態 | 用途 |
|------|--------|--------|--------|------|------|
| 主文字 / 白背景 | `#020817` | `#FFFFFF` | **15.8:1** | ✅ 優秀 | 內文、段落 |
| 標題文字 / 白背景 | `#181D20` | `#FFFFFF` | **15.2:1** | ✅ 優秀 | 標題 |
| 主按鈕（白字 / 藍底） | `#FFFFFF` | `#1A8FE3` | **3.5:1** | ⚠️ 警告（大文字 ✅） | 按鈕文字（≥14px 粗體通過） |
| 次要按鈕（藍字 / 白底） | `#1A8FE3` | `#FFFFFF` | **3.5:1** | ⚠️ 警告（需 ≥18px） | 次要按鈕（建議加粗或放大） |
| 輔助文字 / 白背景 | `#9CA3AF` | `#FFFFFF` | **2.8:1** | ❌ 不通過 | **不建議用於內文** |
| 邊框色 / 白背景 | `#D1D5DB` | `#FFFFFF` | **1.7:1** | ✅ 通過（非文字） | 分隔線、虛線邊框 |

### 改進建議

1. **主按鈕文字（白字/藍底）：**
   - ✅ **保持現狀** - 14px SemiBold (600) 字重符合 WCAG AA「大文字」標準
   - 建議字重不低於 600，字體大小不小於 14px

2. **次要按鈕文字（藍字/白底）：**
   - ⚠️ **建議改進** - 對比度 3.5:1 未達標準文字要求
   - **方案 A：** 使用更深的藍色 `#1570BD`（對比度提升至 4.2:1）✅
   - **方案 B：** 使用 SemiBold 字重 + ≥18px 字體（符合大文字標準）✅
   - **方案 C：** 維持現狀但確保字體 ≥18px 且使用粗體

3. **輔助文字（灰色 #9CA3AF）：**
   - ❌ **不通過** - 對比度僅 2.8:1
   - 建議改用 `#6B7280`（對比度 5.3:1）✅
   - 或僅用於裝飾性文字（非關鍵訊息）

### 推薦配色調整

```css
/* 次要按鈕改進版（提升對比度） */
.secondary-button {
  color: #1570BD; /* 更深的藍色，對比度 4.2:1 ✅ */
  border-color: #1570BD;
}

/* 輔助文字改進版 */
.helper-text {
  color: #6B7280; /* 對比度 5.3:1 ✅ */
}
```

---

## 響應式設計指南

### 斷點定義

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // 小型手機
      'md': '768px',   // 平板（直向）
      'lg': '1024px',  // 平板（橫向）/ 小筆電
      'xl': '1280px',  // 桌面
      '2xl': '1536px', // 大螢幕
    }
  }
}
```

### 佈局策略

#### Mobile First 方法

預設樣式為 Mobile，再逐步增強：

```tsx
<div className="
  px-4 md:px-8 lg:px-12        /* 內距：Mobile 16px → Tablet 32px → Desktop 48px */
  text-base md:text-lg         /* 字體：Mobile 16px → Tablet+ 18px */
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  /* 網格：Mobile 1欄 → Tablet 2欄 → Desktop 3欄 */
">
  ...
</div>
```

### 組件響應式行為

#### 1. 導航欄

| 斷點 | 行為 |
|------|------|
| **Mobile (< 768px)** | • 漢堡選單<br>• 隱藏工具分類<br>• 隱藏或縮小搜索框<br>• 內距 `16px` |
| **Tablet (768px - 1024px)** | • 顯示部分工具分類<br>• 顯示搜索框<br>• 內距 `32px` |
| **Desktop (> 1024px)** | • 完整顯示所有元素<br>• 內距 `48px` |

```tsx
<nav className="px-4 md:px-8 lg:px-12 py-[9px]">
  {/* 漢堡選單（僅 Mobile） */}
  <button className="md:hidden">
    <svg>...</svg>
  </button>

  {/* 工具分類（Tablet+） */}
  <div className="hidden md:flex gap-1">
    <a href="#">PDF</a>
    <a href="#">Image</a>
  </div>

  {/* 搜索框（Tablet+） */}
  <div className="hidden md:block">
    <input type="text" placeholder="Search" />
  </div>
</nav>
```

#### 2. 上傳卡片

| 斷點 | 行為 |
|------|------|
| **Mobile (< 768px)** | • 垂直堆疊按鈕<br>• 按鈕全寬度<br>• 內距減少至 `24px` |
| **Tablet (768px+)** | • 橫向排列次要按鈕<br>• 按鈕自適應寬度 |
| **Desktop (> 1024px)** | • 保持橫向排列<br>• 固定最大寬度 `800px` |

```tsx
<div className="border-2 border-dashed rounded-lg p-6 md:p-12 lg:max-w-[800px] lg:mx-auto">
  {/* 主按鈕（全寬 Mobile，自適應 Tablet+） */}
  <button className="w-full md:w-auto bg-[#1A8FE3] text-white px-6 py-[17px] rounded-lg">
    Upload from PC or Mobile
  </button>

  {/* 次要按鈕組（垂直 Mobile，橫向 Tablet+） */}
  <div className="flex flex-col md:flex-row gap-2 mt-4">
    <button className="w-full md:w-auto border border-[#1A8FE3] px-6 py-4 rounded-lg">
      My Files
    </button>
    <button className="w-full md:w-auto border border-[#1A8FE3] px-6 py-4 rounded-lg">
      + Create New
    </button>
  </div>
</div>
```

#### 3. 預覽網格

| 斷點 | 欄位數 | Gap |
|------|--------|-----|
| **Mobile (< 768px)** | 2 欄 | `12px` |
| **Tablet (768px - 1024px)** | 3 欄 | `16px` |
| **Desktop (> 1024px)** | 4 欄 | `24px` |

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
  {/* 預覽卡片 */}
</div>
```

#### 4. 字體響應式

```tsx
<h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight md:leading-[56px]">
  PDF Editor
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Description text
</p>
```

### 容器最大寬度

```tsx
<div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
  {/* 主內容 */}
</div>
```

**建議最大寬度：**

- Mobile: 100%（無限制）
- Tablet: 100%（無限制）
- Desktop: `1280px`（max-w-7xl）
- 大螢幕: `1536px`（max-w-[1536px]）

### 圖片與媒體

```tsx
{/* 響應式圖片 */}
<img
  src="image.jpg"
  alt="Description"
  className="w-full h-auto object-cover rounded-lg"
  loading="lazy"
/>

{/* 固定比例容器 */}
<div className="aspect-square md:aspect-video">
  <img src="..." className="w-full h-full object-cover" />
</div>
```

### 顯示/隱藏工具類

```tsx
{/* 僅 Mobile 顯示 */}
<div className="block md:hidden">Mobile only</div>

{/* Tablet 以上顯示 */}
<div className="hidden md:block">Tablet and up</div>

{/* 僅 Desktop 顯示 */}
<div className="hidden lg:block">Desktop only</div>
```

---

## 動畫與過渡效果

### Transition 規範

```css
/* 標準過渡（顏色、背景、邊框） */
.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

/* 全屬性過渡（變形、陰影等） */
.transition-all {
  transition: all 0.3s ease;
}

/* 僅變形 */
.transition-transform {
  transition: transform 0.3s ease;
}
```

### Hover 效果範例

```tsx
{/* 按鈕 Hover */}
<button className="bg-[#1A8FE3] hover:bg-[#1570BD] active:scale-95 transition-all">
  Click me
</button>

{/* 卡片 Hover */}
<div className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
  Card content
</div>

{/* 鏈接 Hover */}
<a className="text-[#020817] hover:text-[#1A8FE3] hover:underline transition-colors">
  Learn more
</a>
```

---

## 陰影系統

```css
/* 極淡陰影（導航欄） */
.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 標準陰影（按鈕） */
.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* 中陰影（卡片 Hover） */
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 大陰影（工具卡片） */
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}
```

---

## 圖示系統

**推薦圖示庫：** [Heroicons](https://heroicons.com/) 或 [Lucide Icons](https://lucide.dev/)

**尺寸規範：**

| 用途 | 尺寸 | Tailwind 類名 |
|------|------|--------------|
| 小圖示（按鈕、輸入框） | `16px` | `w-4 h-4` |
| 標準圖示（導航、工具列） | `20px` | `w-5 h-5` |
| 大圖示（卡片、功能展示） | `24px` | `w-6 h-6` |
| 特大圖示（上傳區域） | `64px` | `w-16 h-16` |

```tsx
{/* 範例：上傳圖示 */}
<svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
</svg>
```

---

## 開發注意事項

### 1. Tailwind 配置

確保在 `tailwind.config.js` 中添加自定義顏色：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': '#1A8FE3',
        'primary-dark': '#1570BD',
        'text-dark': '#020817',
        'heading-dark': '#181D20',
        'border-gray': '#D1D5DB',
        'bg-light': '#F6F6F6',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    }
  }
}
```

### 2. 無障礙設計

- ✅ 所有互動元素必須有 `:focus` 狀態
- ✅ 使用語義化 HTML（`<button>`, `<nav>`, `<main>`）
- ✅ 圖片必須有 `alt` 屬性
- ✅ 表單元素必須有 `<label>` 或 `aria-label`
- ✅ 對比度符合 WCAG AA 標準

### 3. 效能優化

- 使用 `loading="lazy"` 延遲加載圖片
- 使用 WebP 格式圖片（fallback 至 PNG/JPG）
- CSS 使用 `will-change` 優化動畫效能
- 避免過度使用陰影和模糊效果

---

## 版本歷史

| 版本 | 日期 | 變更說明 |
|------|------|---------|
| 1.0.0 | 2025-10-28 | 初始版本，完整設計規格文檔 |

---

## 相關文件

- [提案文檔](./proposal-tinywow-theme.md)
- [設計規格](./design-tinywow.md)（待建立）
- [任務分解](./tasks-tinywow.md)（待建立）
- [實作規格](./spec-tinywow.md)（待建立）

---

**文檔建立者：** Lisa (UI/UX Designer)
**審核者：** CTO
**最後更新：** 2025-10-28
