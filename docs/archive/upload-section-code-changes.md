# upload-section.tsx 代碼修改明細

**檔案位置**：`frontend/components/features/upload-section.tsx`
**任務**：取消註解所有 ONNX 代碼，啟用完整去背功能
**執行者**：Waylon（前端開發工程師）

---

## 📝 修改總覽

| 區塊 | 行號 | 操作 | 說明 |
|------|------|------|------|
| Import | 6-14 | 取消註解 | 引入 ONNX Runtime 工具函數 |
| State | 21 | 取消註解 | 新增 session state 管理 |
| initONNX | 24-44 | 取消註解 + 修改 | ONNX 初始化函數 |
| AI 處理 | 62-92 | 取消註解 | 完整 AI 去背流程 |
| 臨時代碼 | 94-96 | **刪除** | 移除臨時原圖顯示邏輯 |

---

## 🔧 詳細修改步驟

### 修改 1：取消註解 Import 語句（第 6-14 行）

**原代碼**：
```typescript
// Commented out for future use when model is ready
// import {
//   initializeONNXRuntime,
//   loadModel,
//   preprocessImage,
//   runInference,
//   postprocessMask,
// } from '@/lib/ai/onnx-runtime';
// import * as ort from 'onnxruntime-web';
```

**修改後**：
```typescript
// Import ONNX Runtime utilities
import {
  initializeONNXRuntime,
  loadModel,
  preprocessImage,
  runInference,
  postprocessMask,
} from '@/lib/ai/onnx-runtime';
import * as ort from 'onnxruntime-web';
```

---

### 修改 2：取消註解 State 管理（第 21 行）

**原代碼**：
```typescript
  const [isProcessing, setIsProcessing] = useState(false);
  // Commented out for future use when model is ready
  // const [_session, _setSession] = useState<ort.InferenceSession | null>(null);
```

**修改後**：
```typescript
  const [isProcessing, setIsProcessing] = useState(false);
  const [_session, _setSession] = useState<ort.InferenceSession | null>(null);
```

---

### 修改 3：取消註解並修改 initONNX 函數（第 24-44 行）

**原代碼**：
```typescript
  // 初始化 ONNX Runtime（僅執行一次）
  // const initONNX = useCallback(async () => {
  //   const initialized = await initializeONNXRuntime();
  //   if (!initialized) {
  //     alert('ONNX Runtime 初始化失敗，請重新整理頁面');
  //     return null;
  //   }
  //
  //   // 載入模型（此處使用占位符路徑，實際部署時需替換）
  //   // const loadedSession = await loadModel('/models/u2net.onnx');
  //   // if (!loadedSession) {
  //   //   alert('AI 模型載入失敗，請檢查網路連線');
  //   //   return null;
  //   // }
  //
  //   // _setSession(loadedSession);
  //   // return loadedSession;
  //
  //   // 暫時返回 null（模型檔案需另外準備）
  //   console.log('[UploadSection] ONNX Runtime 初始化完成（模型尚未載入）');
  //   return null;
  // }, []);
```

**修改後**：
```typescript
  // 初始化 ONNX Runtime（僅執行一次）
  const initONNX = useCallback(async () => {
    const initialized = await initializeONNXRuntime();
    if (!initialized) {
      alert('ONNX Runtime 初始化失敗，請重新整理頁面');
      return null;
    }

    // 載入模型
    const loadedSession = await loadModel('/models/u2net.onnx');
    if (!loadedSession) {
      alert('AI 模型載入失敗，請檢查網路連線');
      return null;
    }

    _setSession(loadedSession);
    return loadedSession;
  }, []);
```

**⚠️ 重點**：
- 刪除「暫時返回 null」的註解（第 41-43 行）
- 取消第 32-36 行的註解（模型載入邏輯）

---

### 修改 4：取消註解 AI 處理流程（第 62-92 行）

**原代碼**：
```typescript
          img.onload = async () => {
            // 初始化 ONNX Runtime
            // const onnxSession = await initONNX();
            // if (!onnxSession) {
            //   setIsProcessing(false);
            //   return;
            // }

            // 預處理圖片
            // const inputTensor = await preprocessImage(img);
            // if (!inputTensor) {
            //   alert('圖片預處理失敗');
            //   setIsProcessing(false);
            //   return;
            // }

            // 執行推論
            // const outputTensor = await runInference(onnxSession, inputTensor);
            // if (!outputTensor) {
            //   alert('AI 處理失敗');
            //   setIsProcessing(false);
            //   return;
            // }

            // 後處理遮罩
            // const resultCanvas = postprocessMask(outputTensor, img);
            // if (!resultCanvas) {
            //   alert('結果處理失敗');
            //   setIsProcessing(false);
            //   return;
            // }

            // setProcessedImage(resultCanvas.toDataURL('image/png'));

            // 暫時使用原圖作為處理結果（模型尚未整合）
            console.log('[UploadSection] 圖片已載入（AI 處理功能待整合）');
            setProcessedImage(imageUrl);
            setIsProcessing(false);
          };
```

**修改後**：
```typescript
          img.onload = async () => {
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
            setIsProcessing(false);
          };
```

**⚠️ 重點**：
- **完全刪除**第 94-96 行（臨時原圖顯示代碼）
- 所有 ONNX 處理流程都需取消註解

---

## ✅ 修改前後對比總結

| 項目 | 修改前 | 修改後 |
|------|--------|--------|
| Import ONNX | ❌ 註解 | ✅ 啟用 |
| Session State | ❌ 註解 | ✅ 啟用 |
| initONNX 函數 | ❌ 部分註解 | ✅ 完全啟用 |
| AI 處理流程 | ❌ 全部註解 | ✅ 完全啟用 |
| 臨時原圖顯示 | ⚠️ 存在（第 94-96 行） | ✅ 已刪除 |

---

## 🧪 驗證方式

### 1. TypeScript 類型檢查
```bash
cd frontend
npm run build
```

**預期結果**：無類型錯誤

### 2. 執行開發伺服器
```bash
npm run dev
```

**預期結果**：伺服器正常啟動於 http://localhost:5173

### 3. 瀏覽器 Console 檢查
開啟瀏覽器後，應看到以下 Log：
```
[ONNX Runtime] 初始化成功，使用 WebGL backend
```

上傳圖片後，應看到：
```
[ONNX Runtime] 模型載入成功: /models/u2net.onnx
[ONNX Runtime] 推論成功，輸出形狀: [1, 1, 320, 320]
```

### 4. 功能驗證
- ✅ 上傳圖片
- ✅ 顯示載入動畫
- ✅ 顯示去背結果（非原圖）
- ✅ 可下載 PNG（透明背景）
- ✅ 可下載 JPG（白色背景）

---

## 📦 提交代碼

**Git Commit 指令**：
```bash
git add frontend/components/features/upload-section.tsx
git commit -m "feat(ui): enable ONNX background removal functionality

- Uncomment all ONNX runtime code in upload-section.tsx
- Enable complete AI processing pipeline
- Remove temporary placeholder code

Refs: docs/specs/implementation-guide-onnx.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🆘 常見問題

### Q1: 取消註解後出現 TypeScript 錯誤？
**A**: 確認 `frontend/lib/ai/onnx-runtime.ts` 檔案存在且內容完整。

### Q2: 模型載入失敗？
**A**: 確認 `frontend/public/models/u2net.onnx` 存在且大小約 4.7 MB。

### Q3: 推論速度過慢？
**A**: 檢查瀏覽器是否支援 WebGL 2.0，或考慮降低圖片解析度。

---

**完成後通知 CTO 進行代碼審查。**
