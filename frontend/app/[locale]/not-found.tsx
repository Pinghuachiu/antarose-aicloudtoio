import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/features/language-switcher';

/**
 * 客製化 404 頁面 (Coming Soon)
 *
 * 根據 spec.md 第 1.3 節：
 * 預留工具（compress, crop, convert）顯示友善的 Coming Soon 404
 */
export default function NotFoundPage() {
  const t = useTranslations('comingSoon');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* 語言切換器 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Coming Soon 內容 */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="text-8xl mb-4">🚧</div>
        <h1 className="text-display-1 md:text-display-2 gradient-text">
          {t('title')}
        </h1>
        <p className="text-body-lg md:text-body-xl text-neutral-400 max-w-2xl">
          {t('description')}
        </p>
        <Link
          href="/removebg"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full"
        >
          <span>{t('backToRemoveBG')}</span>
          <span>→</span>
        </Link>
      </div>

      {/* 提示信息 */}
      <div className="mt-16 text-center">
        <p className="text-caption text-neutral-500">
          目前可用的工具：
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link
            href="/removebg"
            className="glass-card px-6 py-3 hover:bg-neutral-800/60 transition-all duration-300"
          >
            <span className="text-2xl mb-2 block">📷</span>
            <span className="text-body-sm text-neutral-300">去背工具</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
