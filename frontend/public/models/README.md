# ONNX Models Directory

## U²Net Lite Model

**模型名稱：** u2net-lite.onnx
**用途：** 圖片背景移除（Background Removal）
**大小：** 約 4.7 MB

### 下載模型

您可以從以下來源下載 U²Net Lite ONNX 模型：

1. **官方 GitHub Repository:**
   - https://github.com/xuebinqin/U-2-Net
   - 下載預訓練模型並轉換為 ONNX 格式

2. **ONNX Model Zoo:**
   - https://github.com/onnx/models

3. **Hugging Face:**
   - https://huggingface.co/models?other=u2net

### 放置位置

下載後請將 `u2net-lite.onnx` 放置在此目錄下：

```
frontend/public/models/u2net-lite.onnx
```

### 模型規格

- **輸入形狀：** `[1, 3, 320, 320]` (NCHW format)
- **輸出形狀：** `[1, 1, 320, 320]` (遮罩)
- **Backend：** WebGL (GPU 加速)
- **執行環境：** 瀏覽器端 (onnxruntime-web)

### 注意事項

⚠️ **模型檔案未包含在 Git 版本控制中**（已加入 .gitignore）

原因：
- 檔案大小較大（4.7 MB）
- 避免 Git 倉庫膨脹
- 不同部署環境可能使用不同模型版本

部署時請確保模型檔案正確放置在此目錄下。
