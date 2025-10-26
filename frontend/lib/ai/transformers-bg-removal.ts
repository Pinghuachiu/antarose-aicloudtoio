/**
 * Transformers.js Background Removal
 * 使用 @xenova/transformers 和 MODNet 模型
 * 模型：Xenova/modnet (Apache 2.0 License - 可商用)
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

    // 載入 MODNet 模型（Apache 2.0 - 可商用）
    model = await AutoModel.from_pretrained('Xenova/modnet', {
      device: 'webgpu',
    });
    processor = await AutoProcessor.from_pretrained('Xenova/modnet');

    console.log('[Transformers] 模型載入成功');
    return true;
  } catch (error) {
    console.error('[Transformers] 模型載入失敗:', error);
    return false;
  }
}

/**
 * 執行背景移除（MODNet 模型）
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

    // 推論（產生 alpha matte）
    const { output } = await model({ input: pixel_values });

    // 後處理：取得遮罩並調整大小
    const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
      image.width,
      image.height
    );

    // 建立 canvas
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;

    // 繪製原圖
    ctx.drawImage(imageElement, 0, 0);

    // 取得像素資料
    const pixelData = ctx.getImageData(0, 0, image.width, image.height);
    const maskData = mask.data;

    // 將 mask 值直接應用到 alpha 通道（產生平滑邊緣）
    for (let i = 0; i < maskData.length; ++i) {
      pixelData.data[4 * i + 3] = maskData[i];
    }

    ctx.putImageData(pixelData, 0, 0);

    console.log('[Transformers] 處理完成');
    return pixelData;
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
