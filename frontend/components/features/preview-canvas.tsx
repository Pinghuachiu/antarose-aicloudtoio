'use client';

import { useTranslations } from 'next-intl';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

type PreviewCanvasProps = {
  originalImage: string;
  processedImage: string | null;
  onDownload: (format: 'png' | 'jpg') => void;
  onReset: () => void;
  isProcessing?: boolean;
};

export function PreviewCanvas({
  originalImage,
  processedImage,
  onDownload,
  onReset,
  isProcessing = false,
}: PreviewCanvasProps) {
  const t = useTranslations('preview');
  const tDownload = useTranslations('download');
  const tUpload = useTranslations('upload');
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    let clientX: number;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }

    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-h3 text-neutral-100">{t('title')}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* 圖片對照滑桿容器 */}
        <div
          className="relative aspect-square bg-neutral-900 overflow-hidden cursor-ew-resize"
          onMouseMove={handleSliderChange}
          onTouchMove={handleSliderChange}
        >
          {/* 原圖層 */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalImage}
              alt={t('original')}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-4 left-4 bg-neutral-900/80 backdrop-blur-sm px-3 py-1 rounded-lg text-caption text-neutral-300">
              {t('original')}
            </div>
          </div>

          {/* 去背圖層 */}
          {processedImage && (
            <>
              <div
                className="absolute inset-0 overflow-hidden transition-all duration-75"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={processedImage}
                  alt={t('result')}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-4 right-4 bg-primary-500/80 backdrop-blur-sm px-3 py-1 rounded-lg text-caption text-white">
                  {t('result')}
                </div>
              </div>

              {/* 拖曳滑桿 */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary-500 shadow-[0_0_10px_rgba(0,112,243,0.8)] cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* 滑桿圓點 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-500 border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-4 bg-white rounded-full"></div>
                    <div className="w-0.5 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 處理中遮罩 */}
          {isProcessing && (
            <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="loading-pulse w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500"></div>
                <p className="text-body text-neutral-100">{tUpload('processing')}</p>
              </div>
            </div>
          )}
        </div>

        {/* 下載按鈕組 */}
        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            size="lg"
            className="flex-1"
            onClick={() => onDownload('png')}
            disabled={!processedImage || isProcessing}
          >
            <Download className="w-5 h-5 mr-2" />
            {tDownload('downloadPNG')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={() => onDownload('jpg')}
            disabled={!processedImage || isProcessing}
          >
            <Download className="w-5 h-5 mr-2" />
            {tDownload('downloadJPG')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            disabled={isProcessing}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {tDownload('newImage')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
