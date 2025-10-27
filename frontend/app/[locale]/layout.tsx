import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Noto_Sans_TC, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google';
import { locales, type Locale } from '@/locales';
import { Toaster } from '@/components/ui/toaster';
import { NavBar } from '@/components/NavBar/NavBar';
import { ToolBar } from '@/components/ToolBar';
import { StructuredData } from '@/components/StructuredData';
import '../globals.css';

// 字體配置 - 多語系支援
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-tc',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-sc',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-noto-jp',
});

// 字體映射
const fontMap: Record<Locale, string> = {
  'zh-tw': notoSansTC.variable,
  'zh-cn': notoSansSC.variable,
  'en': inter.variable,
  'ja': notoSansJP.variable,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 動態 Metadata 生成（支援多語言 SEO）
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  // 多語言 Meta Tags
  const titles: Record<string, string> = {
    'zh-tw': 'AI 去背小幫手 - 免費線上圖片去背工具',
    'en': 'AI Background Remover - Free Online Image Background Removal Tool',
    'zh-cn': 'AI 去背小助手 - 免费在线图片去背工具',
    'ja': 'AI 背景除去ツール - 無料オンライン画像背景除去'
  };

  const descriptions: Record<string, string> = {
    'zh-tw': '免登入、不上傳、全程本機處理的 AI 圖片去背工具。使用 WebGL 加速，隱私安全又快速。',
    'en': 'No login required. Privacy-first. 100% local processing AI background removal tool with WebGL acceleration.',
    'zh-cn': '免登录、不上传、全程本地处理的 AI 图片去背工具。使用 WebGL 加速，隐私安全快速。',
    'ja': 'ログイン不要・アップロード不要・完全ローカル処理のAI背景除去ツール。WebGL加速でプライバシー保護と高速処理を実現。'
  };

  const keywords: Record<string, string> = {
    'zh-tw': 'AI, 去背, 圖片處理, 線上工具, 免費, 隱私, WebGL',
    'en': 'AI, background removal, image editing, online tool, free, privacy, WebGL',
    'zh-cn': 'AI, 去背, 图片处理, 在线工具, 免费, 隐私, WebGL',
    'ja': 'AI, 背景除去, 画像編集, オンラインツール, 無料, プライバシー, WebGL'
  };

  const ogTitles: Record<string, string> = {
    'zh-tw': 'AI 去背小幫手',
    'en': 'AI Background Remover',
    'zh-cn': 'AI 去背小助手',
    'ja': 'AI 背景除去ツール'
  };

  const ogDescriptions: Record<string, string> = {
    'zh-tw': '免登入、不上傳、全程本機處理的 AI 圖片去背工具',
    'en': 'No login required. Privacy-first. 100% local processing AI background removal tool',
    'zh-cn': '免登录、不上传、全程本地处理的 AI 图片去背工具',
    'ja': 'ログイン不要・アップロード不要・完全ローカル処理のAI背景除去ツール'
  };

  return {
    title: titles[locale] || titles['zh-tw'],
    description: descriptions[locale] || descriptions['zh-tw'],
    keywords: keywords[locale] || keywords['zh-tw'],
    authors: [{ name: 'CloudTo.io' }],
    alternates: {
      canonical: `https://tools.cloudto.io/${locale}`,
      languages: {
        'zh-TW': '/zh-tw',
        'en': '/en',
        'zh-CN': '/zh-cn',
        'ja': '/ja',
        'x-default': '/zh-tw'
      }
    },
    openGraph: {
      title: ogTitles[locale] || ogTitles['zh-tw'],
      description: ogDescriptions[locale] || ogDescriptions['zh-tw'],
      type: 'website',
      url: `https://tools.cloudto.io/${locale}`,
      locale: locale,
    },
    twitter: {
      card: 'summary',
      title: ogTitles[locale] || ogTitles['zh-tw'],
      description: ogDescriptions[locale] || ogDescriptions['zh-tw'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params as { locale: Locale };

  // 載入對應語言的翻譯檔案
  const messages = await getMessages();

  return (
    <html lang={locale} className={fontMap[locale]} suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body className="antialiased bg-white text-text-primary font-sans">
        <NextIntlClientProvider messages={messages}>
          <div className="relative flex min-h-screen flex-col">
            {/* NavBar - 固定在頂部 */}
            <NavBar />

            {/* ToolBar - 響應式工具列 */}
            <ToolBar />

            {/* 主內容區域 - 調整高度避免被 NavBar 和 TabBar 遮擋 */}
            <main className="flex-1 pt-16 md:pb-0 pb-16">{children}</main>
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
