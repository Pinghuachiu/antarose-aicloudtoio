/**
 * 多語系配置
 * 支援語言：繁中、簡中、英文、日文
 */

export const locales = ['zh-tw', 'en', 'zh-cn', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh-tw';

export const localeNames: Record<Locale, string> = {
  'zh-tw': '繁體中文',
  'en': 'English',
  'zh-cn': '简体中文',
  'ja': '日本語',
};

export const localeFlags: Record<Locale, string> = {
  'zh-tw': '🇹🇼',
  'en': '🇺🇸',
  'zh-cn': '🇨🇳',
  'ja': '🇯🇵',
};

/**
 * 瀏覽器語言映射
 * 用於自動偵測時的備用方案（如果需要）
 */
export const browserLanguageMap: Record<string, Locale> = {
  'zh-TW': 'zh-tw',
  'zh-HK': 'zh-tw', // 香港使用繁體中文
  'zh-MO': 'zh-tw', // 澳門使用繁體中文
  'zh-CN': 'zh-cn',
  'zh-SG': 'zh-cn', // 新加坡使用簡體中文
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'ja': 'ja',
  'ja-JP': 'ja',
};

/**
 * 取得使用者語言偏好
 * 優先順序：localStorage > 預設繁體中文
 */
export function getUserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  // 讀取 localStorage
  const saved = localStorage.getItem('locale');
  if (saved && locales.includes(saved as Locale)) {
    return saved as Locale;
  }

  // 預設繁體中文（不使用瀏覽器自動偵測）
  return defaultLocale;
}

/**
 * 儲存使用者語言偏好
 */
export function setUserLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}

/**
 * 語言顯示名稱（包含旗幟）
 */
export function getLocaleName(locale: Locale, withFlag = true): string {
  const flag = withFlag ? `${localeFlags[locale]} ` : '';
  return `${flag}${localeNames[locale]}`;
}
