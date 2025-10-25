'use client';

import { useTranslations } from 'next-intl';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type UploadCardProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

export function UploadCard({ onFileSelect, disabled = false }: UploadCardProps) {
  const t = useTranslations('upload');

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card className="group">
      <CardContent className="p-8 md:p-12">
        <div
          className="
            border-2 border-dashed border-neutral-700
            rounded-2xl p-12 md:p-16
            flex flex-col items-center justify-center
            transition-all duration-300
            group-hover:border-primary-500
            group-hover:bg-primary-500/5
          "
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* 上傳圖示 - 漸變色 */}
          <div className="w-16 h-16 md:w-20 md:h-20 mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* 主標題 */}
          <h3 className="text-h3 md:text-h2 text-neutral-100 mb-2 text-center">
            {t('dragDrop')}
          </h3>

          {/* 副標題 */}
          <p className="text-body-sm md:text-body text-neutral-400 mb-6 text-center">
            {t('or')}
          </p>

          {/* 上傳按鈕 */}
          <Button
            variant="default"
            size="lg"
            disabled={disabled}
            className="mb-4"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-input')?.click();
            }}
          >
            {t('selectFile')}
          </Button>

          {/* 檔案限制提示 */}
          <div className="space-y-1 text-center">
            <p className="text-caption text-neutral-500">{t('supportedFormats')}</p>
            <p className="text-caption text-neutral-500">{t('maxSize')}</p>
          </div>

          {/* 隱藏的檔案輸入 */}
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileInput}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
