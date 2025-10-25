'use client';

import { useState, useCallback } from 'react';
import { UploadCard } from './upload-card';
import { PreviewCanvas } from './preview-canvas';
import { useToast } from '@/hooks/use-toast';
import {
  initializeONNXRuntime,
  loadModel,
  preprocessImage,
  runInference,
  postprocessMask,
} from '@/lib/ai/onnx-runtime';
import * as ort from 'onnxruntime-web';

export function UploadSection() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const { toast } = useToast();

  // 初始化 ONNX Runtime（僅執行一次）
  const initONNX = useCallback(async () => {
    const initialized = await initializeONNXRuntime();
    if (!initialized) {
      toast({
        title: 'ONNX Runtime 初始化失敗',
        description: '請重新整理頁面或使用其他瀏覽器',
        variant: 'destructive',
      });
      return null;
    }

    // 載入模型
    const loadedSession = await loadModel('/models/u2netp.onnx');
    if (!loadedSession) {
      toast({
        title: 'AI 模型載入失敗',
        description: '無法載入模型檔案。請檢查 Console 查看詳細錯誤。',
        variant: 'destructive',
      });
      return null;
    }

    setSession(loadedSession);
    toast({
      title: '模型載入成功',
      description: '準備開始處理圖片',
    });
    return loadedSession;
  }, [toast]);

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
              // 初始化 ONNX Runtime
              const onnxSession = session || (await initONNX());
              if (!onnxSession) {
                setIsProcessing(false);
                return;
              }

              // 預處理圖片
              const inputTensor = await preprocessImage(img);
              if (!inputTensor) {
                toast({
                  title: '圖片預處理失敗',
                  description: '無法處理圖片格式',
                  variant: 'destructive',
                });
                setIsProcessing(false);
                return;
              }

              // 執行推論
              const outputTensor = await runInference(onnxSession, inputTensor);
              if (!outputTensor) {
                toast({
                  title: 'AI 處理失敗',
                  description: '推論過程出錯，請查看 Console',
                  variant: 'destructive',
                });
                setIsProcessing(false);
                return;
              }

              // 後處理遮罩
              const resultCanvas = postprocessMask(outputTensor, img);
              if (!resultCanvas) {
                toast({
                  title: '結果處理失敗',
                  description: '無法生成去背結果',
                  variant: 'destructive',
                });
                setIsProcessing(false);
                return;
              }

              toast({
                title: '處理完成！',
                description: '您可以下載去背後的圖片',
              });

              setProcessedImage(resultCanvas.toDataURL('image/png'));
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
    [toast, session, initONNX]
  );

  // 下載圖片
  const handleDownload = useCallback(
    (format: 'png' | 'jpg') => {
      if (!processedImage) return;

      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `background-removed.${format}`;
      link.click();
    },
    [processedImage]
  );

  // 重置
  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
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
