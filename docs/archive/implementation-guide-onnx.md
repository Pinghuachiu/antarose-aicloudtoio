# ONNX 去背功能實施指引

**文件類型**：技術實施指引（CTO 提供）
**目標受眾**：前端開發工程師 Waylon
**日期**：2025-10-25
**緊急程度**：🔴 緊急修復

---

## 📋 任務概述

**問題描述**：
- `frontend/components/features/upload-section.tsx` 所有 ONNX 代碼被註解（第 6-96 行）
- 導致去背功能完全無法運作，用戶上傳後只顯示原圖

**目標**：
- 啟用完整 ONNX 去背流程
- 下載並部署 U²Net Lite 模型
- 確保功能正常運作

---

## 🔧 實施步驟

### Step 1: 下載 U²Net Lite ONNX 模型

**模型來源選項**：

#### 選項 A：u2netp.onnx - 4.7 MB（推薦 ✅）
```bash
# 使用 curl 下載輕量級模型
cd /Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/frontend/public
mkdir -p models

curl -L https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx \
  -o models/u2net.onnx

# 驗證檔案大小
ls -lh models/u2net.onnx
# 預期輸出：約 4.57M
```

#### 選項 B：u2net.onnx - 176 MB（高精度）
```bash
# 如果需要更高精度，可使用完整版模型
curl -L https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx \
  -o models/u2net-full.onnx
```

**⚠️ 建議使用選項 A**：
- 選項 A (u2netp) 僅 4.7 MB，載入速度快
- 選項 B (u2net) 為 176 MB，載入時間較長但效果更佳
- 根據 PRD 規格，應使用 4.7 MB 輕量版本

**模型規格要求**：
- 格式：ONNX
- 輸入尺寸：320x320（可調整）
- 大小：< 10 MB
- 執行環境：WebGL

**驗證模型是否正確下載**：
```bash
ls -lh /Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/frontend/public/models/u2net.onnx

# 預期輸出：
# -rw-r--r--  1 user  staff   4.7M Oct 25 15:00 u2net.onnx
```

---

### Step 2: 取消註解 upload-section.tsx 代碼

**檔案位置**：
```
/Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/frontend/components/features/upload-section.tsx
```

**需要取消註解的區塊**：

#### 區塊 1：Import 語句（第 6-14 行）
```typescript
// 取消註解：
import {
  initializeONNXRuntime,
  loadModel,
  preprocessImage,
  runInference,
  postprocessMask,
} from '@/lib/ai/onnx-runtime';
import * as ort from 'onnxruntime-web';
```

#### 區塊 2：State 管理（第 21 行）
```typescript
// 取消註解：
const [_session, _setSession] = useState<ort.InferenceSession | null>(null);
```

#### 區塊 3：ONNX 初始化函數（第 24-44 行）
```typescript
// 取消註解整個 initONNX 函數：
const initONNX = useCallback(async () => {
  const initialized = await initializeONNXRuntime();
  if (!initialized) {
    alert('ONNX Runtime 初始化失敗，請重新整理頁面');
    return null;
  }

  // 載入模型（修改路徑為實際位置）
  const loadedSession = await loadModel('/models/u2net.onnx');
  if (!loadedSession) {
    alert('AI 模型載入失敗，請檢查網路連線');
    return null;
  }

  _setSession(loadedSession);
  return loadedSession;
}, []);
```

**⚠️ 重要修改**：
- 取消註解第 32-36 行（模型載入邏輯）
- 刪除第 41-43 行（臨時 console.log）

#### 區塊 4：處理邏輯（第 62-96 行）
```typescript
// 在 img.onload 內部，取消註解所有 AI 處理流程：

// 初始化 ONNX Runtime
const onnxSession = await initONNX();
if (!onnxSession) {
  setIsProcessing(false);
  return;
}

// 預處理圖片
const inputTensor = await preprocessImage(img);
if (!inputTensor) {
  alert('圖片預處理失敗');
  setIsProcessing(false);
  return;
}

// 執行推論
const outputTensor = await runInference(onnxSession, inputTensor);
if (!outputTensor) {
  alert('AI 處理失敗');
  setIsProcessing(false);
  return;
}

// 後處理遮罩
const resultCanvas = postprocessMask(outputTensor, img);
if (!resultCanvas) {
  alert('結果處理失敗');
  setIsProcessing(false);
  return;
}

setProcessedImage(resultCanvas.toDataURL('image/png'));
```

**⚠️ 刪除臨時代碼**：
- 刪除第 94-96 行（臨時原圖顯示邏輯）

---

### Step 3: 測試功能

**測試步驟**：

1. **啟動開發伺服器**
```bash
cd /Users/jackalchiu/Documents/Antarose-projects/antarose-aicloudtoio/frontend
npm run dev
```

2. **開啟瀏覽器測試**
```
http://localhost:5173
```

3. **執行功能測試**
   - ✅ 上傳圖片（JPG/PNG）
   - ✅ 確認有載入動畫
   - ✅ 確認處理後背景被移除（非原圖）
   - ✅ 測試下載 PNG 格式
   - ✅ 測試下載 JPG 格式

4. **檢查瀏覽器 Console**
```javascript
// 預期看到的 Log：
// [ONNX Runtime] 初始化成功，使用 WebGL backend
// [ONNX Runtime] 模型載入成功: /models/u2net.onnx
// [ONNX Runtime] 推論成功，輸出形狀: [1, 1, 320, 320]
```

5. **性能測試**
   - 桌面處理時間：應 < 5 秒
   - 移動處理時間：應 < 15 秒

---

## ✅ 驗收檢查清單

### 功能驗收
- [ ] 可成功上傳圖片（支援 JPG, PNG, WebP）
- [ ] 去背效果正確（背景透明，主體保留）
- [ ] 可下載 PNG 格式（透明背景）
- [ ] 可下載 JPG 格式（白色背景）
- [ ] 處理時間符合規格要求

### 錯誤處理驗收
- [ ] 模型載入失敗時顯示錯誤訊息
- [ ] 圖片過大時給予提示（> 2048x2048）
- [ ] 不支援格式時給予提示
- [ ] 推論失敗時可以重試

### 代碼品質驗收
- [ ] 所有 ONNX 代碼已取消註解
- [ ] 沒有臨時測試代碼殘留
- [ ] Console.log 僅保留必要的日誌
- [ ] 符合 TypeScript 類型檢查

---

## 🐛 常見問題排查

### 問題 1：模型載入失敗
**錯誤訊息**：`AI 模型載入失敗，請檢查網路連線`

**解決方案**：
1. 確認模型檔案存在：`ls frontend/public/models/u2net.onnx`
2. 確認檔案大小正確（約 4.7 MB）
3. 檢查瀏覽器 Network 面板，確認請求成功

### 問題 2：推論速度過慢
**症狀**：處理時間 > 15 秒

**解決方案**：
1. 檢查是否使用 WebGL backend（Console 應顯示 "使用 WebGL backend"）
2. 確認圖片尺寸未超過 2048x2048
3. 考慮降低 `targetSize` 參數（預設 320）

### 問題 3：去背效果不佳
**症狀**：主體邊緣有殘留或部分被移除

**解決方案**：
1. 確認使用正確的模型（U²Net 或替代方案）
2. 檢查 `postprocessMask` 函數的閾值設定
3. 考慮使用更高解析度的模型

---

## 📦 提交代碼

**提交前檢查**：
1. ✅ 執行測試：`npm run test`
2. ✅ 確認無 TypeScript 錯誤：`npm run build`
3. ✅ 確認無 ESLint 錯誤：`npm run lint`

**Git Commit 格式**：
```bash
git add frontend/components/features/upload-section.tsx
git add frontend/public/models/u2net.onnx

git commit -m "feat(ui): enable ONNX background removal functionality

- Uncomment all ONNX runtime code in upload-section.tsx
- Add U²Net Lite model (4.7 MB)
- Implement complete background removal pipeline
- Test on desktop and mobile devices

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 📞 支援聯絡

如遇到技術問題，請回報給 CTO 進行協助。

**測試完成後，通知 Lucia（QA 工程師）執行 E2E 測試驗證。**
