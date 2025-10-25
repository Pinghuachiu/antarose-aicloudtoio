'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, Chrome, Download } from 'lucide-react';
import { checkWebGLSupport } from '@/lib/ai/onnx-runtime';

export function BrowserCheck() {
  const t = useTranslations('browserCheck');
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // 僅在客戶端執行瀏覽器檢測
    const supported = checkWebGLSupport();
    setIsSupported(supported);
  }, []);

  // 尚未檢測完成時不顯示
  if (isSupported === null) {
    return null;
  }

  // 瀏覽器支援時不顯示警告
  if (isSupported) {
    return null;
  }

  // 瀏覽器不支援時顯示警告卡片
  return (
    <div className="mb-8">
      <div className="glass-card p-6 border-2 border-warning-500/50 bg-warning-500/5">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-warning-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-h4 text-neutral-100 mb-2">{t('unsupported')}</h3>
            <p className="text-body-sm text-neutral-400 mb-4">{t('requireWebGL')}</p>
            <p className="text-body-sm text-neutral-500 mb-6">{t('recommendBrowsers')}</p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.google.com/chrome/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-body-sm text-neutral-100 transition-colors"
              >
                <Chrome className="w-4 h-4" />
                {t('downloadChrome')}
              </a>

              <a
                href="https://www.microsoft.com/edge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-body-sm text-neutral-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('downloadEdge')}
              </a>

              <a
                href="https://www.mozilla.org/firefox/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-body-sm text-neutral-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('downloadFirefox')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
