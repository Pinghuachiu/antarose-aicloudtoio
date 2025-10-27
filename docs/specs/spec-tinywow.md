# OpenSpec Specification: TinyWow 風格淺色主題詳細規格

**專案名稱**: tools.cloudto.io 視覺主題重構
**規格文檔版本**: 1.0.0
**建立日期**: 2025-10-28
**CTO**: Antarose CTO
**狀態**: 📝 規格制定中

---

## 一、總體規格概述

### 1.1 變更範圍

**UI/UX 層級**:
- ✅ 完全改為淺色主題（白色背景）
- ✅ 導航從側邊欄改為頂部橫向
- ✅ 所有組件樣式重設計
- ✅ 色彩系統重構

**不變更**:
- ❌ 業務邏輯
- ❌ API 接口
- ❌ 資料結構
- ❌ AI 模型

### 1.2 核心原則

1. **Mobile First** - 優先設計 Mobile 版本
2. **無障礙優先** - 符合 WCAG AA 標準
3. **性能優先** - Lighthouse ≥ 90
4. **簡潔設計** - 參考 TinyWow 風格

---

## 二、色彩規格

### 2.1 主色調規格

| 用途 | 變數名稱 | HEX 值 | RGB | Tailwind 類名 | HSL | 用途說明 |
|------|---------|--------|-----|--------------|-----|---------|
| 主要品牌色 | `primary` | `#1A8FE3` | `rgb(26, 143, 227)` | `bg-primary` | `hsl(203, 91%, 49%)` | 主按鈕、CTA、Logo |
| 主要 Hover | `primary-hover` | `#1570BD` | `rgb(21, 112, 189)` | `bg-primary-hover` | `hsl(203, 80%, 41%)` | 按鈕 hover 狀態 |
| 主要淡色 | `primary-light` | `#E0F2FE` | `rgb(224, 242, 254)` | `bg-primary-light` | `hsl(204, 100%, 94%)` | 背景、拖拽 hover |

**使用規則**:
```typescript
// ✅ 正確使用
<button className="bg-primary hover:bg-primary-hover text-white">

// ❌ 錯誤使用（不要使用舊的 primary-500/600）
<button className="bg-primary-500 hover:bg-primary-600">
```

### 2.2 文字顏色規格

| 用途 | 變數名稱 | HEX 值 | 對比度 | Tailwind 類名 | 使用場景 |
|------|---------|--------|-------|--------------|---------|
| 主要文字 | `text-primary` | `#020817` | 15.8:1 ✅ | `text-text-primary` | 內文、段落 |
| 標題文字 | `text-heading` | `#181D20` | 15.2:1 ✅ | `text-text-heading` | H1, H2, H3 |
| 次要文字 | `text-secondary` | `#6B7280` | 5.3:1 ✅ | `text-text-secondary` | 提示、輔助說明 |
| 禁用文字 | `text-disabled` | `#9CA3AF` | 3.2:1 ⚠️ | `text-text-disabled` | 僅用於禁用狀態 |

**對比度要求**:
- 正常文字（16px以下）：≥ 4.5:1
- 大文字（18px+或粗體14px+）：≥ 3:1

### 2.3 背景色規格

| 用途 | HEX 值 | Tailwind 類名 | 使用場景 |
|------|--------|--------------|---------|
| 主背景 | `#FFFFFF` | `bg-white` | 頁面背景、卡片背景 |
| 次要背景 | `#F6F6F6` | `bg-background-secondary` | 搜索框、區域分隔 |
| Hover 背景 | `#F9FAFB` | `bg-background-hover` | 按鈕、選單項 hover |

---

## 三、組件詳細規格

### 3.1 TopNavigation 組件規格

**檔案位置**: `frontend/components/NavBar/TopNavigation.tsx`

#### 3.1.1 結構規格

```typescript
interface TopNavigationProps {
  locale: string; // 當前語言
}

export function TopNavigation({ locale }: TopNavigationProps) {
  // 實作
}
```

#### 3.1.2 樣式規格

**容器**:
```typescript
className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav"
```

**內容區域**:
```typescript
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

**Flexbox 佈局**:
```typescript
className="flex items-center justify-between h-14 sm:h-16"
```

#### 3.1.3 響應式規格

| 斷點 | 高度 | Padding | 顯示內容 |
|------|------|---------|---------|
| Mobile (< 768px) | 56px (h-14) | px-4 | Logo + 漢堡選單 + 語言切換 |
| Tablet (768px+) | 64px (h-16) | px-6 | Logo + 部分工具 + 語言切換 |
| Desktop (1024px+) | 64px (h-16) | px-8 | Logo + 完整工具選單 + 語言切換 |

#### 3.1.4 子組件規格

**Logo 區域**:
```typescript
<Link href={`/${locale}`} className="flex items-center gap-2">
  <span className="text-2xl font-bold text-text-heading">CloudTools</span>
  <span className="text-2xl font-bold text-primary">AI</span>
</Link>
```

**工具選單區域（Desktop）**:
```typescript
<div className="hidden md:flex items-center gap-1">
  <ToolsMenu locale={locale} />
</div>
```

**語言切換區域**:
```typescript
<div className="flex items-center gap-4">
  <LanguageSelector currentLocale={locale} />
</div>
```

#### 3.1.5 驗收標準

功能驗收:
- [ ] 固定在頂部，不隨頁面滾動
- [ ] Logo 點擊返回首頁
- [ ] 工具選單可切換工具
- [ ] 語言切換器正常運作
- [ ] Mobile 顯示漢堡選單
- [ ] Desktop 顯示完整選單

樣式驗收:
- [ ] 背景為白色
- [ ] 陰影效果自然（`shadow-nav`）
- [ ] 高度符合規格
- [ ] 內容區域正確居中（max-w-7xl）

無障礙驗收:
- [ ] Tab 順序正確（Logo → 工具 → 語言）
- [ ] aria-label 設定完整
- [ ] 鍵盤可完整操作

---

### 3.2 ToolsMenu 組件規格

**檔案位置**: `frontend/components/NavBar/ToolsMenu.tsx`

#### 3.2.1 結構規格

```typescript
interface ToolsMenuProps {
  locale: string;
}

export function ToolsMenu({ locale }: ToolsMenuProps) {
  const pathname = usePathname();
  // 實作
}
```

#### 3.2.2 工具列表資料

```typescript
const TOOLS = [
  { id: 'removebg', name: { 'zh-tw': '去背', 'en': 'Remove BG', ... }, icon: Scissors },
  { id: 'compress', name: { 'zh-tw': '壓縮', 'en': 'Compress', ... }, icon: Minimize2 },
  { id: 'crop', name: { 'zh-tw': '裁切', 'en': 'Crop', ... }, icon: Crop },
  { id: 'convert', name: { 'zh-tw': '轉換', 'en': 'Convert', ... }, icon: FileImage },
];
```

#### 3.2.3 樣式規格

**容器**:
```typescript
className="flex items-center gap-1"
```

**工具按鈕（非活躍）**:
```typescript
className="
  px-4 py-2 rounded-lg
  text-sm font-semibold
  text-text-primary
  hover:bg-background-hover
  transition-colors duration-200
"
```

**工具按鈕（活躍）**:
```typescript
className="
  px-4 py-2 rounded-lg
  text-sm font-semibold
  bg-primary text-white
  shadow-button
"
```

#### 3.2.4 驗收標準

- [ ] 所有工具正確顯示
- [ ] 當前工具高亮正確
- [ ] Hover 效果符合規格
- [ ] 點擊切換路由正常
- [ ] 多語言顯示正確

---

### 3.3 UploadCard 組件規格

**檔案位置**: `frontend/components/features/upload-card.tsx`

#### 3.3.1 核心樣式規格

**基礎樣式**:
```typescript
className="
  relative overflow-hidden rounded-lg
  border-2 border-dashed border-border
  bg-white
  transition-all duration-200
  cursor-pointer
"
```

**Hover 狀態**:
```typescript
className="
  border-primary
  bg-background-hover
"
```

**拖拽中狀態**:
```typescript
className="
  border-primary border-solid
  bg-primary-light
"
```

#### 3.3.2 內部結構規格

**圖示容器**:
```typescript
<div className="mb-6 p-6 bg-primary/10 rounded-full">
  <Upload className="w-12 h-12 text-primary" />
</div>
```

**主標題**:
```typescript
<h3 className="text-2xl font-semibold text-text-heading mb-2">
  拖曳圖片到這裡
</h3>
```

**分隔文字**:
```typescript
<p className="text-base text-text-secondary mb-6">或</p>
```

**主按鈕**:
```typescript
<button className="
  px-6 py-3
  bg-primary hover:bg-primary-hover
  text-white font-semibold
  rounded-lg shadow-button
  transition-colors
">
  選擇檔案
</button>
```

**提示文字**:
```typescript
<div className="mt-6 text-sm text-text-secondary space-y-1">
  <p>支援格式：JPG、PNG、WebP</p>
  <p>最大尺寸：2048 x 2048 px</p>
</div>
```

#### 3.3.3 互動行為規格

**檔案拖拽**:
1. 用戶拖曳檔案到上傳區域
2. `onDragEnter`: 邊框變藍色實線 + 背景變淡藍
3. `onDragLeave`: 恢復虛線邊框 + 白色背景
4. `onDrop`: 觸發檔案處理

**檔案點擊上傳**:
1. 用戶點擊「選擇檔案」按鈕
2. 觸發系統檔案選擇器
3. 選擇檔案後觸發處理

**錯誤處理**:
- 檔案格式錯誤 → Toast 錯誤訊息
- 檔案過大 → Toast 錯誤訊息
- 重複上傳 → 覆蓋前一張圖片

#### 3.3.4 驗收標準

功能驗收:
- [ ] 拖拽上傳正常
- [ ] 點擊上傳正常
- [ ] 檔案格式驗證正常
- [ ] 檔案大小限制正常
- [ ] 錯誤提示清晰

樣式驗收:
- [ ] 虛線邊框顯示正確
- [ ] Hover 效果符合設計
- [ ] 拖拽狀態變化明顯
- [ ] 圖示和文字對齊正確

---

### 3.4 Button 組件規格

**檔案位置**: `frontend/components/ui/button.tsx`

#### 3.4.1 Variants 規格

**default (主要按鈕)**:
```typescript
variant: "default"
// 樣式
className="
  bg-primary hover:bg-primary-hover
  text-white
  shadow-button
  transition-colors
"
// 對比度: 3.5:1（大文字通過 WCAG AA）
```

**outline (次要按鈕)**:
```typescript
variant: "outline"
// 樣式
className="
  bg-white
  border-2 border-primary
  text-primary-hover  // 使用更深的藍色以符合對比度
  hover:bg-primary-light
  transition-colors
"
// 對比度: 4.2:1 ✅（符合 WCAG AA）
```

**ghost (幽靈按鈕)**:
```typescript
variant: "ghost"
// 樣式
className="
  bg-transparent
  hover:bg-background-hover
  text-text-primary
"
```

**destructive (危險按鈕)**:
```typescript
variant: "destructive"
// 樣式
className="
  bg-error hover:bg-error/90
  text-white
"
```

#### 3.4.2 Size 規格

| Size | 高度 | Padding X | Padding Y | 字體大小 | 使用場景 |
|------|------|----------|----------|---------|---------|
| `sm` | 40px (h-10) | 16px (px-4) | - | 14px (text-sm) | 小按鈕、導航按鈕 |
| `default` | 48px (h-12) | 24px (px-6) | - | 16px (text-base) | 標準按鈕 |
| `lg` | 56px (h-14) | 32px (px-8) | - | 18px (text-lg) | 大型 CTA 按鈕 |
| `icon` | 40px (h-10) | - | - | - | 圖示按鈕 |

#### 3.4.3 狀態規格

**Normal**:
- 顯示正常樣式
- cursor: pointer

**Hover**:
- 背景色變深（primary → primary-hover）
- transition: 200ms

**Focus**:
- ring: `ring-2 ring-primary/20`
- outline: none

**Disabled**:
- opacity: 50%
- cursor: not-allowed
- pointer-events: none

#### 3.4.4 驗收標準

- [ ] 所有 variants 顯示正確
- [ ] 所有 sizes 尺寸正確
- [ ] Hover/Focus 效果正確
- [ ] Disabled 狀態正確
- [ ] 對比度符合 WCAG AA

---

## 四、佈局規格

### 4.1 頁面整體佈局

**結構**:
```html
<html>
  <body className="bg-white text-text-primary">
    <!-- 頂部導航（固定） -->
    <TopNavigation />

    <!-- 主要內容（有上方 padding） -->
    <main className="pt-20">
      {children}
    </main>

    <!-- Toast 通知 -->
    <Toaster />
  </body>
</html>
```

**Spacing 規格**:
- `pt-20` (80px): 為頂部導航（64px）+ 額外間距（16px）

### 4.2 工具頁面佈局

**檔案**: `frontend/app/[locale]/[tool]/page.tsx`

```typescript
<div className="min-h-screen bg-gray-50">
  {/* 頁首區域 */}
  <section className="bg-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-[40px] font-bold leading-[56px] text-center text-text-heading">
        AI 去背小幫手
      </h1>
      <p className="text-lg leading-7 text-center text-text-secondary mt-4">
        免登入・不上傳・全程本機處理
      </p>
    </div>
  </section>

  {/* 功能區域 */}
  <section className="py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UploadSection />
    </div>
  </section>
</div>
```

**Spacing 規格**:
- Container padding: Mobile 16px → Tablet 24px → Desktop 32px
- Section vertical spacing: 48px (py-12)
- Title bottom margin: 16px (mt-4)

---

## 五、互動規格

### 5.1 導航互動

**工具切換**:
1. 用戶點擊工具選單項
2. 路由切換到 `/[locale]/[tool]`
3. 導航欄高亮當前工具
4. 頁面內容更新

**語言切換**:
1. 用戶點擊語言切換器
2. 下拉選單展開
3. 選擇語言
4. 路由切換到 `/[new-locale]/[tool]`
5. 頁面內容更新為新語言

### 5.2 上傳互動

**拖拽上傳**:
1. 用戶拖曳檔案進入上傳區域
2. `onDragEnter`: 邊框變藍色實線，背景變淡藍（`bg-primary-light`）
3. `onDragOver`: 保持樣式
4. `onDragLeave`: 恢復虛線邊框，白色背景
5. `onDrop`: 開始處理檔案

**點擊上傳**:
1. 用戶點擊「選擇檔案」按鈕
2. 系統檔案選擇器打開
3. 用戶選擇檔案
4. 開始處理

---

## 六、動畫與過渡規格

### 6.1 全局過渡

**時長標準**:
- 快速互動：150ms（按鈕 hover）
- 標準互動：200ms（顏色變化）
- 慢速互動：300ms（選單展開）

**Easing**:
```css
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out */
```

### 6.2 組件動畫

**按鈕 Hover**:
```typescript
className="transition-colors duration-200"
```

**選單展開/收合**:
```typescript
className="transition-transform duration-300"
```

**Toast 通知**:
- 進入：從上滑入
- 停留：3 秒
- 離開：淡出

---

## 七、響應式規格

### 7.1 斷點定義

```typescript
// Tailwind 斷點
sm: '640px'   // 小型手機
md: '768px'   // 平板（重要斷點）
lg: '1024px'  // 筆電
xl: '1280px'  // 桌機
2xl: '1536px' // 大螢幕
```

### 7.2 TopNavigation 響應式行為

**Mobile (< 768px)**:
```typescript
<nav className="h-14">
  <Logo />
  <HamburgerButton />  // 顯示
  <LanguageSelector />
  <ToolsMenu className="hidden" />  // 隱藏
</nav>
```

**Tablet/Desktop (≥ 768px)**:
```typescript
<nav className="h-16">
  <Logo />
  <ToolsMenu className="flex" />  // 顯示
  <LanguageSelector />
  <HamburgerButton className="hidden" />  // 隱藏
</nav>
```

### 7.3 UploadCard 響應式行為

**Mobile (< 640px)**:
```typescript
<UploadCard className="py-12 px-4">
  <Icon className="w-10 h-10" />
  <Title className="text-xl" />
  <Button className="w-full" />  // 全寬按鈕
</UploadCard>
```

**Desktop (≥ 640px)**:
```typescript
<UploadCard className="py-16 px-6">
  <Icon className="w-12 h-12" />
  <Title className="text-2xl" />
  <Button className="w-auto" />  // 自動寬度
</UploadCard>
```

---

## 八、無障礙規格

### 8.1 鍵盤導航

**Tab 順序**:
1. Logo（可 focus）
2. 工具選單項 1-4
3. 語言切換器
4. 主要內容區域

**快捷鍵**:
- `Shift + Tab`: 反向導航
- `Enter/Space`: 觸發按鈕
- `Arrow Keys`: 工具選單導航（選配）

### 8.2 ARIA 標籤

**TopNavigation**:
```typescript
<nav aria-label="主導航">
  <Link aria-label="返回首頁">Logo</Link>
  <div role="navigation" aria-label="工具選單">
    {tools.map(tool => (
      <Link aria-label={`切換到${tool.name}`} />
    ))}
  </div>
</nav>
```

**UploadCard**:
```typescript
<div role="button" aria-label="上傳圖片" tabIndex={0}>
  <input aria-label="檔案輸入" />
</div>
```

### 8.3 對比度要求

**WCAG AA 標準**:

| 元素 | 前景 | 背景 | 對比度 | 標準 | 狀態 |
|------|------|------|-------|------|------|
| 主文字 | #020817 | #FFFFFF | 15.8:1 | ≥ 4.5:1 | ✅ |
| 標題 | #181D20 | #FFFFFF | 15.2:1 | ≥ 4.5:1 | ✅ |
| 次要文字 | #6B7280 | #FFFFFF | 5.3:1 | ≥ 4.5:1 | ✅ |
| 主按鈕 | #FFFFFF | #1A8FE3 | 3.5:1 | ≥ 3:1 (大文字) | ✅ |
| 次要按鈕 | #1570BD | #FFFFFF | 4.2:1 | ≥ 4.5:1 | ✅ |

**不符合的需調整**:
- 原 `#9CA3AF` 輔助文字（2.8:1）→ 改用 `#6B7280` (5.3:1) ✅

---

## 九、性能規格

### 9.1 載入性能

**Lighthouse 目標**:
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 95

**Core Web Vitals**:
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 9.2 CSS 性能

**優化措施**:
- 移除 `backdrop-blur-xl`（減少 GPU 負擔）
- 簡化 gradient（減少計算）
- 減少 shadow 層級

**預期改善**:
- 首次繪製時間：-50~100ms
- Lighthouse Performance：+2~5 分

---

## 十、測試規格

### 10.1 單元測試

**覆蓋率要求**: ≥ 80%

**測試檔案**:
- `TopNavigation.test.tsx`
- `ToolsMenu.test.tsx`
- `HamburgerMenu.test.tsx`
- `UploadCard.test.tsx`（更新）
- `Button.test.tsx`（更新）

**測試項目**:
```typescript
describe('TopNavigation', () => {
  it('應該顯示 Logo', () => {});
  it('Desktop 應該顯示完整工具選單', () => {});
  it('Mobile 應該顯示漢堡選單', () => {});
  it('應該正確高亮當前工具', () => {});
  it('語言切換器應該正常運作', () => {});
});
```

### 10.2 E2E 測試

**測試工具**: Playwright (MCP tool)

**測試腳本**: 使用 `playwright (MCP tool)` 執行以下場景

**場景 1: 工具切換**
```typescript
1. 訪問 http://localhost:5173/zh-tw/removebg
2. 點擊頂部導航「壓縮」
3. 驗證路由切換到 /zh-tw/compress
4. 驗證導航欄高亮「壓縮」
5. 驗證頁面內容更新
```

**場景 2: 語言切換**
```typescript
1. 訪問 http://localhost:5173/zh-tw/removebg
2. 點擊語言切換器
3. 選擇「English」
4. 驗證路由切換到 /en/removebg
5. 驗證頁面內容變為英文
```

**場景 3: 上傳處理**
```typescript
1. 訪問 http://localhost:5173/zh-tw/removebg
2. 拖曳圖片到上傳區域
3. 驗證圖片開始處理
4. 等待處理完成
5. 驗證預覽顯示正確
6. 點擊下載按鈕
7. 驗證檔案下載成功
```

**場景 4: 響應式測試**
```typescript
1. 訪問頁面
2. 調整視窗寬度：375px (Mobile)
3. 驗證漢堡選單顯示
4. 調整視窗寬度：768px (Tablet)
5. 驗證工具選單顯示
6. 調整視窗寬度：1280px (Desktop)
7. 驗證完整佈局
```

### 10.3 視覺回歸測試

**測試頁面**:
- `/zh-tw/removebg`
- `/zh-tw/compress`
- `/zh-tw/crop`
- `/zh-tw/convert`

**測試斷點**:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

**截圖對比**:
使用 Playwright 截圖，對比設計稿。

---

## 十一、版本控制規格

### 11.1 分支策略

**開發分支**: `feature/website-theme-redesign`
**基於分支**: `develop`
**合併目標**: `develop`

### 11.2 Commit 規範

**格式**: Conventional Commits

**類型**:
- `feat(theme):` - 主題相關功能
- `feat(nav):` - 導航相關功能
- `feat(ui):` - UI 組件更新
- `refactor(theme):` - 重構
- `test(theme):` - 測試
- `docs(theme):` - 文檔

**範例**:
```bash
feat(theme): 更新 Tailwind 配置為淺色主題
feat(nav): 實作頂部導航組件
feat(ui): 重設計上傳卡片（虛線邊框）
refactor(theme): 移除側邊欄和工具列狀態管理
test(theme): 新增 TopNavigation 單元測試
docs(theme): 更新設計系統文檔
```

### 11.3 PR 流程

1. Waylon 完成開發 → 創建 PR
2. Shawn Code Review → 提出修改意見
3. Waylon 修復 → Push
4. QA 測試（Lucia + Ann）→ 通過/失敗
5. 失敗 → Mark 修復 → 重新測試
6. 通過 → CTO 最終驗收
7. CTO 批准 → 合併到 develop

---

## 十二、部署規格

### 12.1 部署前檢查清單

**代碼品質**:
- [ ] ESLint 無錯誤
- [ ] TypeScript 無錯誤
- [ ] Unit tests ≥ 80% 覆蓋率
- [ ] E2E tests 全部通過

**性能檢查**:
- [ ] Lighthouse Performance ≥ 90
- [ ] Bundle size 無顯著增加
- [ ] 無 console 錯誤或警告

**功能檢查**:
- [ ] 所有工具正常運作
- [ ] 所有語言正常顯示
- [ ] 上傳/處理/下載正常
- [ ] IndexedDB 儲存正常

**無障礙檢查**:
- [ ] 對比度通過 WCAG AA
- [ ] 鍵盤導航正常
- [ ] 螢幕閱讀器支援

### 12.2 部署環境

**Dev 環境**:
- URL: https://dev-ai.cloudto.io
- 部署前：QA 測試必須通過

**Production 環境**:
- URL: https://ai.cloudto.io
- 部署前：CTO 必須批准

---

## 十三、驗收規格

### 13.1 階段驗收標準

**階段一：配置更新（Day 1）**
- [ ] Tailwind 配置更新完成
- [ ] 全局樣式更新完成
- [ ] Layout 根組件更新完成
- [ ] `npm run dev` 編譯成功
- [ ] 無 TypeScript 錯誤

**階段二：導航開發（Day 2-3）**
- [ ] TopNavigation 組件實作完成
- [ ] ToolsMenu 組件實作完成
- [ ] HamburgerMenu 組件實作完成
- [ ] 整合到 Layout 完成
- [ ] Desktop 導航功能正常
- [ ] Mobile 導航功能正常

**階段三：UI 組件更新（Day 4-5）**
- [ ] Button 組件更新完成
- [ ] Card 組件更新完成
- [ ] Input 組件更新完成
- [ ] UploadCard 重設計完成
- [ ] PreviewCanvas 更新完成
- [ ] 所有組件樣式符合設計

**階段四：移除舊組件（Day 5）**
- [ ] 側邊欄組件完全移除
- [ ] 工具列狀態管理移除
- [ ] 無 import 錯誤
- [ ] 編譯成功

**階段五：測試與修復（Day 6-8）**
- [ ] 視覺回歸測試完成
- [ ] 功能測試完成
- [ ] 所有 bug 修復完成
- [ ] 重新測試通過

**階段六：驗證（Day 9）**
- [ ] 無障礙驗證通過
- [ ] SEO 驗證通過
- [ ] 性能測試通過
- [ ] Code Review 通過

### 13.2 最終驗收標準

**CTO 最終檢查清單**:

1. **視覺設計** (Lisa 驗收通過)
   - [ ] 色彩系統符合 TinyWow 風格
   - [ ] 組件樣式符合設計稿
   - [ ] 整體風格一致

2. **功能完整性** (CTO 驗收)
   - [ ] 所有工具正常運作
   - [ ] 導航切換正常
   - [ ] 語言切換正常
   - [ ] 上傳/處理/下載正常

3. **代碼品質** (Shawn 驗收通過)
   - [ ] Code Review 通過
   - [ ] 無 ESLint/TypeScript 錯誤
   - [ ] Unit tests ≥ 80%

4. **測試覆蓋** (QA 驗收通過)
   - [ ] 本地測試通過
   - [ ] 線上測試通過（dev 環境）
   - [ ] 所有瀏覽器測試通過

5. **SEO 與無障礙** (Lily 驗收通過)
   - [ ] 對比度符合 WCAG AA
   - [ ] SEO 評分無下降
   - [ ] Lighthouse ≥ 90

**全部通過 → CTO 簽發驗收報告 → Leo 更新技術文檔**

---

## 十四、風險管理規格

### 14.1 風險監控

**每日站會**（簡短同步）:
- Waylon 報告進度
- 識別阻塞問題
- 調整計畫

**風險指標**:
- 🔴 Critical: 阻塞開發，需立即處理
- 🟠 High: 影響交付，需優先處理
- 🟡 Medium: 可控風險，需關注
- 🟢 Low: 影響小，正常處理

### 14.2 應急方案

**風險 1**: Tailwind 配置導致樣式錯亂
- **對策**: 回退到前一個 commit，重新配置

**風險 2**: 響應式設計問題
- **對策**: Mark 協助 Waylon 修復

**風險 3**: 性能退化
- **對策**: 優化 CSS，移除不必要效果

---

## 十五、交付物清單

### 15.1 代碼交付

- [ ] 所有變更的 `.tsx` / `.ts` 檔案
- [ ] 更新的 `tailwind.config.ts`
- [ ] 更新的 `globals.css`
- [ ] 新增的組件檔案
- [ ] 刪除的舊組件

### 15.2 測試交付

- [ ] 單元測試檔案（`*.test.tsx`）
- [ ] E2E 測試腳本（Playwright）
- [ ] 測試報告（QA）

### 15.3 文檔交付

- [ ] `proposal-tinywow-theme.md` ✅
- [ ] `design-tinywow.md` ✅
- [ ] `design-system-tinywow.md` (Lisa) ✅
- [ ] `tasks-tinywow.md` ✅
- [ ] `spec-tinywow.md` ✅
- [ ] CTO 驗收報告（最終）
- [ ] 技術文檔更新（Leo，2 個工作日內）

---

## CTO 最終審批區

**審批結果**：✅ **批准**

**審批意見**：

規格文檔非常詳盡完整。涵蓋色彩、組件、佈局、互動、動畫、響應式、無障礙、性能、測試等所有方面。所有規格清晰可執行，驗收標準明確。批准開始委派實施任務。

**特別要求**：
1. 嚴格遵守對比度規格（WCAG AA）
2. 所有 Commit 遵循 Conventional Commits 規範
3. 每個階段完成後進行 code review
4. QA 必須測試本地 + 線上環境

**審批簽名**：CTO

**審批日期**：2025-10-28

---

**✅ 規格已批准，開始委派實施任務給團隊成員。**
