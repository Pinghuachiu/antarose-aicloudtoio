/**
 * ONNX Runtime WebGL Backend 工具類別
 * 用於初始化和管理 ONNX Runtime 推論引擎
 */

import * as ort from 'onnxruntime-web';

/**
 * 初始化 ONNX Runtime
 * 配置 WebGL backend 以使用 GPU 加速
 */
export async function initializeONNXRuntime() {
  try {
    // 設定執行環境為 WebGL（GPU 加速）
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.simd = true;

    // 使用 WebGL backend
    ort.env.webgl.contextId = 'webgl2';
    ort.env.webgl.matmulMaxBatchSize = 16;
    ort.env.webgl.pack = true;

    console.log('[ONNX Runtime] 初始化成功，使用 WebGL backend');
    return true;
  } catch (error) {
    console.error('[ONNX Runtime] 初始化失敗:', error);
    return false;
  }
}

/**
 * 載入 ONNX 模型
 * @param modelPath 模型檔案路徑（相對於 public 目錄）
 * @returns InferenceSession 實例
 */
export async function loadModel(modelPath: string): Promise<ort.InferenceSession | null> {
  try {
    const session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['webgl'], // 使用 WebGL backend
      graphOptimizationLevel: 'all',
    });

    console.log('[ONNX Runtime] 模型載入成功:', modelPath);
    return session;
  } catch (error) {
    console.error('[ONNX Runtime] 模型載入失敗:', error);
    return null;
  }
}

/**
 * 預處理圖片為模型輸入格式
 * @param imageElement HTML Image 元素
 * @param targetSize 目標尺寸（例如 320）
 * @returns Tensor 輸入數據
 */
export async function preprocessImage(
  imageElement: HTMLImageElement,
  targetSize = 320
): Promise<ort.Tensor | null> {
  try {
    // 建立 Canvas 進行圖片縮放和正規化
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 計算縮放比例（保持長寬比）
    const scale = Math.min(targetSize / imageElement.width, targetSize / imageElement.height);
    const scaledWidth = Math.round(imageElement.width * scale);
    const scaledHeight = Math.round(imageElement.height * scale);

    canvas.width = targetSize;
    canvas.height = targetSize;

    // 填充黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, targetSize, targetSize);

    // 居中繪製縮放後的圖片
    const offsetX = (targetSize - scaledWidth) / 2;
    const offsetY = (targetSize - scaledHeight) / 2;
    ctx.drawImage(imageElement, offsetX, offsetY, scaledWidth, scaledHeight);

    // 獲取圖片數據
    const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
    const { data } = imageData;

    // 轉換為 CHW 格式並正規化到 [0, 1]
    const float32Data = new Float32Array(3 * targetSize * targetSize);
    for (let i = 0; i < targetSize * targetSize; i++) {
      float32Data[i] = data[i * 4] / 255.0; // R
      float32Data[targetSize * targetSize + i] = data[i * 4 + 1] / 255.0; // G
      float32Data[targetSize * targetSize * 2 + i] = data[i * 4 + 2] / 255.0; // B
    }

    // 建立 Tensor (1, 3, targetSize, targetSize)
    const tensor = new ort.Tensor('float32', float32Data, [1, 3, targetSize, targetSize]);
    return tensor;
  } catch (error) {
    console.error('[ONNX Runtime] 圖片預處理失敗:', error);
    return null;
  }
}

/**
 * 執行模型推論
 * @param session ONNX InferenceSession
 * @param inputTensor 輸入 Tensor
 * @returns 輸出 Tensor（遮罩）
 */
export async function runInference(
  session: ort.InferenceSession,
  inputTensor: ort.Tensor
): Promise<ort.Tensor | null> {
  try {
    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = inputTensor;

    const results = await session.run(feeds);
    const output = results[session.outputNames[0]];

    console.log('[ONNX Runtime] 推論成功，輸出形狀:', output.dims);
    return output;
  } catch (error) {
    console.error('[ONNX Runtime] 推論失敗:', error);
    return null;
  }
}

/**
 * 後處理遮罩為可顯示的圖片
 * @param maskTensor 模型輸出的遮罩 Tensor
 * @param originalImage 原始圖片元素
 * @returns Canvas 元素（包含去背後的圖片）
 */
export function postprocessMask(
  maskTensor: ort.Tensor,
  originalImage: HTMLImageElement
): HTMLCanvasElement | null {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // 繪製原始圖片
    ctx.drawImage(originalImage, 0, 0);

    // 獲取圖片數據
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    // 獲取遮罩數據 (假設輸出形狀為 [1, 1, H, W])
    const maskData = maskTensor.data as Float32Array;
    const maskHeight = maskTensor.dims[2];
    const maskWidth = maskTensor.dims[3];

    // 縮放遮罩到原始圖片尺寸
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const maskY = Math.floor((y / canvas.height) * maskHeight);
        const maskX = Math.floor((x / canvas.width) * maskWidth);
        const maskIndex = maskY * maskWidth + maskX;

        const alpha = maskData[maskIndex]; // 遮罩值 [0, 1]
        const pixelIndex = (y * canvas.width + x) * 4;

        // 設定 Alpha 通道
        data[pixelIndex + 3] = Math.round(alpha * 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  } catch (error) {
    console.error('[ONNX Runtime] 後處理失敗:', error);
    return null;
  }
}

/**
 * 檢查瀏覽器是否支援 WebGL 2.0
 */
export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('[ONNX Runtime] 瀏覽器不支援 WebGL');
      return false;
    }

    console.log('[ONNX Runtime] WebGL 支援檢測通過');
    return true;
  } catch (error) {
    console.error('[ONNX Runtime] WebGL 檢測失敗:', error);
    return false;
  }
}
