/**
 * Transformers.js Background Removal
 * 使用 @xenova/transformers 和 RMBG-1.4 模型
 */

import { AutoModel, AutoProcessor, RawImage, env } from '@xenova/transformers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let model: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let processor: any = null;

/**
 * 初始化模型（僅執行一次）
 */
export async function initializeModel() {
  try {
    if (model && processor) {
      console.log('[Transformers] 模型已初始化');
      return true;
    }

    console.log('[Transformers] 開始載入模型...');

    // 配置使用 WebGPU（如果可用）
    env.backends.onnx.wasm.proxy = false;

    // 載入 RMBG-1.4 模型
    model = await AutoModel.from_pretrained('briaai/RMBG-1.4');
    processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4');

    console.log('[Transformers] 模型載入成功');
    return true;
  } catch (error) {
    console.error('[Transformers] 模型載入失敗:', error);
    return false;
  }
}

/**
 * 執行背景移除
 */
export async function removeBackground(imageElement: HTMLImageElement): Promise<ImageData | null> {
  try {
    if (!model || !processor) {
      const initialized = await initializeModel();
      if (!initialized) return null;
    }

    console.log('[Transformers] 開始處理圖片...');

    // 將 HTML Image 轉換為 RawImage
    const image = await RawImage.fromURL(imageElement.src);

    // 預處理
    const { pixel_values } = await processor(image);

    // 推論
    const { output } = await model({ input: pixel_values });

    // 後處理：取得遮罩
    const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);

    // 建立透明背景圖片
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;

    // 繪製原圖
    ctx.drawImage(imageElement, 0, 0);

    // 應用遮罩
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = mask.data;

    // 逐像素應用遮罩（前景保留，背景透明）
    for (let i = 0; i < imageData.data.length; i += 4) {
      const pixelIndex = i / 4;
      const maskValue = maskData[pixelIndex];

      // RMBG 模型：maskValue 越高表示越可能是前景
      // 使用閾值 128 區分前景/背景
      if (maskValue >= 128) {
        // 前景：保持不變，alpha = 255
        imageData.data[i + 3] = 255;
      } else {
        // 背景：設為透明
        imageData.data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    console.log('[Transformers] 處理完成');
    return imageData;
  } catch (error) {
    console.error('[Transformers] 處理失敗:', error);
    return null;
  }
}

/**
 * 檢查 WebGPU 支援
 */
export function checkWebGPUSupport(): boolean {
  return 'gpu' in navigator;
}
