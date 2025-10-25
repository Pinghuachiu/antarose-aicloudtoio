import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './locales';

export default createMiddleware({
  // 支援的語言列表
  locales,

  // 預設語言（繁體中文）
  defaultLocale,

  // 不使用瀏覽器自動偵測（避免誤判）
  localeDetection: false,

  // URL 策略
  localePrefix: 'as-needed', // 預設語言不顯示前綴 /zh-tw
});

export const config = {
  // 匹配所有路徑，除了 API、靜態檔案、模型檔案
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
    '/(zh-tw|en|zh-cn|ja)/:path*',
  ],
};
