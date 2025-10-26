import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@/locales';
import { UploadSection } from '@/components/features/upload-section';
import { BrowserCheck } from '@/components/features/browser-check';
import { LanguageSwitcher } from '@/components/features/language-switcher';
import { AVAILABLE_TOOLS, COMING_SOON_TOOLS } from '@/lib/constants/tools';

type Props = {
  params: Promise<{ locale: Locale; tool: string }>;
};

export default async function ToolPage({ params }: Props) {
  const { locale, tool } = await params;

  // 檢查工具是否可用
  if (AVAILABLE_TOOLS.includes(tool)) {
    // 當前只有 removebg 可用，顯示完整的 RemoveBG 頁面
    return <RemoveBGPage locale={locale} />;
  }

  // 檢查是否為 Coming Soon 工具
  if (COMING_SOON_TOOLS.includes(tool)) {
    return <ComingSoonPage locale={locale} tool={tool} />;
  }

  // 無效的工具，返回 404
  notFound();
}

// RemoveBG 完整頁面（保留原有功能）
function RemoveBGPage({ locale }: { locale: Locale }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* 語言切換器 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero 區塊 */}
      <HeroSection />

      {/* 瀏覽器檢測 */}
      <BrowserCheck />

      {/* 主要上傳區塊 */}
      <UploadSection />

      {/* 功能介紹 */}
      <FeaturesSection />

      {/* 使用步驟 */}
      <StepsSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

// Coming Soon 頁面
function ComingSoonPage({ locale, tool }: { locale: Locale; tool: string }) {
  const t = useTranslations('comingSoon');

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* 語言切換器 - 固定在右上角 */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="text-8xl mb-4">🚧</div>
        <h1 className="text-display-1 md:text-display-2 gradient-text">
          {t('title')}
        </h1>
        <p className="text-body-lg md:text-body-xl text-neutral-400 max-w-2xl">
          {t('description')}
        </p>
        <Link
          href={`/${locale}/removebg`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <span>{t('backToRemoveBG')}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// Hero 區塊
function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="flex flex-col items-center text-center space-y-6 pb-16 pt-8">
      <div className="space-y-4">
        <h1 className="text-display-1 md:text-display-2 gradient-text">
          {t('title')}
        </h1>
        <p className="text-body-lg md:text-body-xl text-neutral-400 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <p className="text-body-sm md:text-body text-neutral-500 max-w-3xl mx-auto">
          {t('description')}
        </p>
      </div>
    </section>
  );
}

// 功能介紹
function FeaturesSection() {
  const t = useTranslations('hero.features');

  const features = [
    {
      title: t('privacy'),
      description: t('privacyDesc'),
      icon: '🔒',
    },
    {
      title: t('fast'),
      description: t('fastDesc'),
      icon: '⚡',
    },
    {
      title: t('free'),
      description: t('freeDesc'),
      icon: '🎉',
    },
  ];

  return (
    <section className="py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass-card p-6 hover:bg-neutral-800/60 transition-all duration-300"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-h4 text-neutral-100 mb-2">{feature.title}</h3>
            <p className="text-body-sm text-neutral-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 使用步驟
function StepsSection() {
  const t = useTranslations('steps');

  const steps = [
    {
      number: 1,
      title: t('step1.title'),
      description: t('step1.desc'),
    },
    {
      number: 2,
      title: t('step2.title'),
      description: t('step2.desc'),
    },
    {
      number: 3,
      title: t('step3.title'),
      description: t('step3.desc'),
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-h2 text-center text-neutral-100 mb-12">{t('title')}</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-h2 text-white mb-4 shadow-glow-primary">
              {step.number}
            </div>
            <h3 className="text-h4 text-neutral-100 mb-2">{step.title}</h3>
            <p className="text-body-sm text-neutral-400">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Footer
function FooterSection() {
  const t = useTranslations('footer');

  return (
    <footer className="py-8 border-t border-neutral-800 mt-16">
      <div className="text-center">
        <p className="text-caption text-neutral-500">{t('copyright')}</p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/about" className="text-caption text-neutral-400 hover:text-primary-500 transition-colors">
            {t('links.about')}
          </Link>
          <Link href="/privacy" className="text-caption text-neutral-400 hover:text-primary-500 transition-colors">
            {t('links.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
