'use client';

import { useState, useCallback, useEffect } from 'react';
import { UploadCard } from './upload-card';
import { PreviewCanvas } from './preview-canvas';
import { useToast } from '@/hooks/use-toast';
import {
  initializeModel,
  removeBackground,
  checkWebGPUSupport,
} from '@/lib/ai/transformers-bg-removal';
import { saveImage, getImage, deleteImage } from '@/lib/storage/indexeddb';

export function UploadSection() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const { toast } = useToast();

  // 從 IndexedDB 恢復狀態（切換語言時保留處理結果）
  useEffect(() => {
    const loadImages = async () => {
      try {
        const [savedOriginal, savedProcessed] = await Promise.all([
          getImage('upload-original-image'),
          getImage('upload-processed-image'),
        ]);

        if (savedOriginal) setOriginalImage(savedOriginal);
        if (savedProcessed) setProcessedImage(savedProcessed);
      } catch (error) {
        console.error('[IndexedDB] 載入圖片失敗:', error);
      }
    };

    loadImages();
  }, []);

  // 儲存狀態到 IndexedDB
  useEffect(() => {
    if (originalImage) {
      saveImage('upload-original-image', originalImage).catch((error) => {
        console.error('[IndexedDB] 儲存原圖失敗:', error);
      });
    } else {
      deleteImage('upload-original-image').catch(console.error);
    }
  }, [originalImage]);

  useEffect(() => {
    if (processedImage) {
      saveImage('upload-processed-image', processedImage).catch((error) => {
        console.error('[IndexedDB] 儲存去背圖失敗:', error);
      });
    } else {
      deleteImage('upload-processed-image').catch(console.error);
    }
  }, [processedImage]);

  // 初始化 Transformers.js 模型（僅執行一次）
  const initModel = useCallback(async () => {
    if (modelReady) return true;

    if (!checkWebGPUSupport()) {
      toast({
        title: '瀏覽器不支援',
        description: '您的瀏覽器不支援 WebGPU。請使用 Chrome 113+ 或 Edge 113+',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: '載入 AI 模型中...',
      description: '首次載入約需 10-20 秒，請稍候',
    });

    const initialized = await initializeModel();
    if (!initialized) {
      toast({
        title: 'AI 模型載入失敗',
        description: '請檢查網路連線並重試',
        variant: 'destructive',
      });
      return false;
    }

    setModelReady(true);
    toast({
      title: '模型載入成功',
      description: '準備開始處理圖片',
    });
    return true;
  }, [toast, modelReady]);

  // 處理檔案選擇
  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsProcessing(true);

      try {
        // 讀取圖片並顯示
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageUrl = e.target?.result as string;
          setOriginalImage(imageUrl);

          // 建立 Image 元素用於處理
          const img = new Image();
          img.onload = async () => {
            try {
              // 初始化模型
              const initialized = await initModel();
              if (!initialized) {
                setIsProcessing(false);
                return;
              }

              // 執行背景移除
              toast({
                title: 'AI 處理中...',
                description: '請稍候，處理時間約 5-15 秒',
              });

              const result = await removeBackground(img);
              if (!result) {
                toast({
                  title: 'AI 處理失敗',
                  description: '無法生成去背結果，請查看 Console',
                  variant: 'destructive',
                });
                setIsProcessing(false);
                return;
              }

              // 將 ImageData 轉換為 Canvas 並輸出
              const canvas = document.createElement('canvas');
              canvas.width = result.width;
              canvas.height = result.height;
              const ctx = canvas.getContext('2d')!;
              ctx.putImageData(result, 0, 0);

              toast({
                title: '處理完成！',
                description: '您可以下載去背後的圖片',
              });

              setProcessedImage(canvas.toDataURL('image/png'));
              setIsProcessing(false);
            } catch (error) {
              console.error('[UploadSection] AI 處理錯誤:', error);
              toast({
                title: 'AI 處理失敗',
                description: `錯誤：${error instanceof Error ? error.message : String(error)}`,
                variant: 'destructive',
              });
              setIsProcessing(false);
            }
          };

          img.src = imageUrl;
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('[UploadSection] 檔案處理失敗:', error);
        toast({
          title: '檔案處理失敗',
          description: `錯誤：${error instanceof Error ? error.message : String(error)}`,
          variant: 'destructive',
        });
        setIsProcessing(false);
      }
    },
    [toast, initModel]
  );

  // 下載圖片（使用原生下載方式）
  const handleDownload = useCallback(
    (format: 'png' | 'jpg') => {
      if (!processedImage) return;

      // 生成檔名（使用時間戳記）
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
      const fileName = `removed-bg-${timestamp}.${format}`;

      // 如果是 JPG 格式，需要加上白色背景
      if (format === 'jpg') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;

          // 填充白色背景
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 繪製去背圖片
          ctx.drawImage(img, 0, 0);

          // 下載 JPG
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              link.click();
              URL.revokeObjectURL(url);
            }
          }, 'image/jpeg', 0.95);
        };
        img.src = processedImage;
      } else {
        // PNG 格式下載
        // 將 data URL 轉為 blob
        fetch(processedImage)
          .then((res) => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
          });
      }
    },
    [processedImage]
  );

  // 重置
  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    // 清除 IndexedDB
    deleteImage('upload-original-image').catch(console.error);
    deleteImage('upload-processed-image').catch(console.error);
  }, []);

  return (
    <section className="py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 上傳區域 */}
        {!originalImage && (
          <div className="lg:col-span-2">
            <UploadCard onFileSelect={handleFileSelect} disabled={isProcessing} />
          </div>
        )}

        {/* 預覽區域 */}
        {originalImage && (
          <div className="lg:col-span-2">
            <PreviewCanvas
              originalImage={originalImage}
              processedImage={processedImage}
              onDownload={handleDownload}
              onReset={handleReset}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </div>
    </section>
  );
}
