# 修復提案：檔案上傳功能故障

## 提案編號
BUGFIX-2025-10-25-001

## 提案日期
2025-10-25 21:15:00 UTC+8

## 提案者
CTO (Antarose AI Tech Inc.)

## 專案類型
Bug Fix - 緊急修復

## 優先級
🔴 **P0 - Critical**

---

## 一、問題描述

### 1.1 問題現象

用戶在 dev 環境 (https://dev-ai.cloudto.io) 點擊「選擇檔案」按鈕後，系統出現 **10 個重複的檔案選擇器 (file chooser)**，導致檔案上傳功能完全無法使用。

### 1.2 問題影響

- 🔴 **嚴重性**: Critical - 核心功能完全故障
- 📊 **影響範圍**: 所有用戶無法使用檔案上傳功能
- 🚫 **業務影響**: 產品核心功能不可用，嚴重影響用戶體驗

### 1.3 問題複現步驟

1. 訪問 https://dev-ai.cloudto.io
2. 點擊「選擇檔案」按鈕
3. 結果：出現 10 個重複的檔案選擇器視窗

### 1.4 預期行為

點擊「選擇檔案」按鈕後，應該只出現 **1 個**檔案選擇器。

---

## 二、根本原因分析

### 2.1 問題代碼位置

**檔案**: `frontend/components/features/upload-card.tsx`

### 2.2 問題代碼

**第 38-54 行 - 外層 div 的 onClick 事件**:
```typescript
<div
  className="..."
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onClick={() => {
    if (!disabled) {
      document.getElementById('file-input')?.click();  // 👈 問題1: 觸發 file input
    }
  }}
>
```

**第 72-83 行 - Button 的 onClick 事件**:
```typescript
<Button
  variant="default"
  size="lg"
  disabled={disabled}
  className="mb-4"
  onClick={(e) => {
    e.stopPropagation();
    document.getElementById('file-input')?.click();  // 👈 問題2: 也觸發 file input
  }}
>
  {t('selectFile')}
</Button>
```

### 2.3 技術分析

**事件衝突機制**:
1. 外層 div 和 Button 都綁定了 onClick 事件
2. 兩者都會觸發同一個 `#file-input` 元素的 click 事件
3. 雖然 Button 使用了 `e.stopPropagation()`，但在某些情況下（React 事件系統、HMR 等）可能失效
4. 導致 file input 被重複觸發 10 次

**為什麼是 10 次？**:
- 可能是 React 的 Hot Module Replacement (HMR) 導致事件監聽器被重複註冊
- 或者是 React Strict Mode 的副作用
- 需要進一步調查,但優先修復功能

---

## 三、修復方案

### 3.1 選定方案

**移除外層 div 的 onClick 事件**，只保留 Button 的 onClick。

### 3.2 修改內容

**修改檔案**: `frontend/components/features/upload-card.tsx`

**修改位置**: 第 38-54 行

#### 修改前:
```typescript
<div
  className="
    border-2 border-dashed border-neutral-700
    rounded-2xl p-12 md:p-16
    flex flex-col items-center justify-center
    transition-all duration-300
    group-hover:border-primary-500
    group-hover:bg-primary-500/5
    cursor-pointer
  "
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onClick={() => {
    if (!disabled) {
      document.getElementById('file-input')?.click();
    }
  }}
>
```

#### 修改後:
```typescript
<div
  className="
    border-2 border-dashed border-neutral-700
    rounded-2xl p-12 md:p-16
    flex flex-col items-center justify-center
    transition-all duration-300
    group-hover:border-primary-500
    group-hover:bg-primary-500/5
  "
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  // 移除 onClick 和 cursor-pointer，避免與 Button onClick 衝突
>
```

**同時移除 className 中的 `cursor-pointer`**

### 3.3 方案優點

✅ **避免事件衝突**: 只保留 Button 的 onClick，消除重複觸發
✅ **保留拖放功能**: onDrop 和 onDragOver 仍然保留完整功能
✅ **符合 UX 最佳實踐**: 使用者點擊按鈕才觸發檔案選擇，符合直覺
✅ **簡化代碼**: 減少不必要的事件處理器
✅ **提升可維護性**: 事件處理邏輯更清晰

### 3.4 替代方案（不採用）

**方案 2**: 移除 Button onClick，只保留外層 div onClick
- ❌ **不採用原因**: UX 不佳，使用者期望點擊按鈕而非區域

**方案 3**: 保留兩個 onClick，修復 stopPropagation
- ❌ **不採用原因**: 過度複雜，且無法保證在所有情況下生效

---

## 四、實作任務

### 4.1 開發任務（Mark 負責）

**Task 1**: 修改 `upload-card.tsx`
- 移除外層 div 的 onClick 事件處理器
- 移除 className 中的 `cursor-pointer`
- 保留 onDrop 和 onDragOver
- 保留 Button 的 onClick

**Task 2**: 本地測試
- 執行 `npm run dev`
- 測試檔案選擇功能
- 確認只出現 1 個檔案選擇器
- 測試拖放功能正常

**Task 3**: 單元測試更新
- 更新 `upload-card.test.tsx`
- 移除外層 div onClick 相關測試
- 確保測試覆蓋率 ≥ 80%

**Task 4**: Git Commit
- 使用 `fix(ui): 移除 UploadCard 外層 div onClick 避免重複觸發`
- 遵循 Conventional Commits 規範

### 4.2 Code Review（Shawn 負責）

- Review Mark 的代碼修改
- 檢查事件處理邏輯正確性
- 確認 UX 體驗改善
- 批准後 notify Mark

### 4.3 QA 測試（Lucia 負責）

**本地測試**:
- 測試檔案選擇功能（確認只有 1 個選擇器）
- 測試拖放功能正常運作
- 測試不同瀏覽器 (Chrome, Edge, Firefox, Safari)

**Dev 環境測試**:
- 部署到 https://dev-ai.cloudto.io
- E2E 測試完整上傳流程
- 檢查 console 無錯誤

### 4.4 最終驗收（CTO）

- 確認所有驗收標準通過
- 批准部署到 Production

---

## 五、驗收標準

### 5.1 功能驗收

- [ ] 點擊「選擇檔案」按鈕，只出現 **1 個**檔案選擇器
- [ ] 可以正常選擇圖片檔案 (JPG/PNG/WebP)
- [ ] 選擇檔案後可以正常上傳和處理
- [ ] 拖放功能仍然正常運作
- [ ] 不同瀏覽器測試通過

### 5.2 測試驗收

- [ ] 單元測試通過
- [ ] 測試覆蓋率 ≥ 80%
- [ ] E2E 測試通過 (本地)
- [ ] E2E 測試通過 (Dev 環境)
- [ ] Console 無錯誤訊息

### 5.3 代碼品質

- [ ] ESLint 無錯誤
- [ ] TypeScript 無 type errors
- [ ] Code Review 通過
- [ ] 遵循 Conventional Commits

---

## 六、時程規劃

| 任務 | 負責人 | 預估時間 |
|------|--------|----------|
| 修改代碼 | Mark | 10 分鐘 |
| 本地測試 | Mark | 10 分鐘 |
| 單元測試更新 | Mark | 10 分鐘 |
| Git Commit | Mark | 5 分鐘 |
| Code Review | Shawn | 10 分鐘 |
| QA 本地測試 | Lucia | 15 分鐘 |
| 部署到 Dev | Louis | 5 分鐘 |
| QA Dev 測試 | Lucia | 10 分鐘 |
| CTO 驗收 | CTO | 5 分鐘 |
| **總計** | - | **約 80 分鐘** |

---

## 七、風險評估

| 風險 | 可能性 | 影響 | 對策 |
|------|--------|------|------|
| 拖放功能受影響 | 低 | 中 | QA 完整測試拖放流程 |
| 其他瀏覽器兼容性問題 | 低 | 中 | 測試多種瀏覽器 |
| 修復後仍有其他 bug | 低 | 低 | 充分本地測試 |

---

## 八、部署計劃

### 8.1 Dev 環境部署

```bash
# SSH 到 VPS
ssh 165.154.226.78

# 進入專案目錄
cd /var/www/ai-cloudto-io-dev/frontend

# 拉取最新代碼
git pull origin develop

# 安裝依賴（如有更新）
npm install

# 建置
npm run build

# 重啟 PM2
pm2 restart ai-cloudto-io-dev
```

### 8.2 Production 環境部署（驗收通過後）

```bash
# 合併到 main branch
git checkout main
git merge develop

# 部署到 Production
ssh 165.154.226.78
cd /var/www/ai-cloudto-io-prd/frontend
git pull origin main
npm install
npm run build
pm2 restart ai-cloudto-io-prd
```

---

## 九、CTO 決策

### ✅ 批准決策

**本人作為 CTO，批准此修復提案，立即執行。**

**批准原因**:
1. ✅ 問題診斷清楚明確
2. ✅ 修復方案簡單有效
3. ✅ 風險可控，影響範圍明確
4. ✅ 預估時間合理（80 分鐘）
5. ✅ 驗收標準完整

**批准時間**: 2025-10-25 21:15:00 UTC+8

---

## 十、下一步行動

### 立即執行

1. **委派給 Mark** (Frontend Bug Fix Engineer)
   - 執行 Task 1-4
   - 預估 35 分鐘

2. **Code Review** (Shawn)
   - Review Mark 的修改
   - 預估 10 分鐘

3. **QA 測試** (Lucia)
   - 本地 + Dev 環境測試
   - 預估 25 分鐘

4. **CTO 最終驗收**
   - 確認所有標準通過
   - 批准部署

---

**提案狀態**: ✅ **已批准，立即執行**

**委派給**: Mark (Frontend Bug Fix Engineer)

**預計完成時間**: 2025-10-25 22:30:00 UTC+8

**CTO 簽名**: CTO (Antarose AI Tech Inc.)
