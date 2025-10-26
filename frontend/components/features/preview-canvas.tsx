'use client';

import { useTranslations } from 'next-intl';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactCompareImage from 'react-compare-image';

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

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-h3 text-neutral-100">{t('title')}</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* 使用 ReactCompareImage（參考 image-matting） */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '80vh',
            maxHeight: '1200px',
            background: 'repeating-conic-gradient(#808080 0% 25%, #ffffff 0% 50%) 50% / 20px 20px',
          }}
        >
          {processedImage ? (
            <ReactCompareImage
              leftImage={originalImage}
              rightImage={processedImage}
              leftImageCss={{ objectFit: 'contain', height: '100%' }}
              rightImageCss={{ objectFit: 'contain', height: '100%' }}
              sliderLineWidth={4}
              sliderLineColor="#0070f3"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalImage}
                alt={t('original')}
                className="h-full w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          {/* 處理中遮罩 */}
          {isProcessing && (
            <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-caption text-neutral-300">{tUpload('processing')}</p>
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
