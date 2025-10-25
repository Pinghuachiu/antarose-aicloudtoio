import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Noto_Sans_TC, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google';
import { locales, type Locale } from '@/locales';
import { Toaster } from '@/components/ui/toaster';
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

export const metadata: Metadata = {
  title: 'AI 去背小幫手 - 免費線上圖片去背工具',
  description: '免登入、不上傳、全程本機處理的 AI 圖片去背工具。使用 WebGL 加速，隱私安全又快速。',
  keywords: 'AI, 去背, 圖片處理, 線上工具, 免費, 隱私, WebGL',
  authors: [{ name: 'CloudTo.io' }],
  openGraph: {
    title: 'AI 去背小幫手',
    description: '免登入、不上傳、全程本機處理的 AI 圖片去背工具',
    type: 'website',
  },
};

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
    <html lang={locale} className={`${fontMap[locale]} dark`} suppressHydrationWarning>
      <body className="antialiased bg-neutral-900 text-neutral-50 font-sans">
        <NextIntlClientProvider messages={messages}>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
