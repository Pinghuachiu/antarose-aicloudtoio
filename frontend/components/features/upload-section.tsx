'use client';

import { useState, useCallback } from 'react';
import { UploadCard } from './upload-card';
import { PreviewCanvas } from './preview-canvas';
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

  // 初始化 ONNX Runtime（僅執行一次）
  const initONNX = useCallback(async () => {
    const initialized = await initializeONNXRuntime();
    if (!initialized) {
      alert('ONNX Runtime 初始化失敗，請重新整理頁面');
      return null;
    }

    // 載入模型
    const loadedSession = await loadModel('/models/u2netp.onnx');
    if (!loadedSession) {
      alert('AI 模型載入失敗，請檢查網路連線');
      return null;
    }

    setSession(loadedSession);
    return loadedSession;
  }, []);

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
            } catch (error) {
              console.error('[UploadSection] AI 處理錯誤:', error);
              alert('AI 處理失敗，請重試');
              setIsProcessing(false);
            }
          };

          img.src = imageUrl;
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('[UploadSection] 檔案處理失敗:', error);
        alert('檔案處理失敗，請重試');
        setIsProcessing(false);
      }
    },
    []
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
