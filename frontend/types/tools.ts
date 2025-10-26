import type { LucideIcon } from 'lucide-react';

/**
 * 工具定義類型
 *
 * 根據 spec.md 第 1.5 節定義
 */
export interface Tool {
  id: string;
  slug: string;
  name: {
    'zh-tw': string;
    'en': string;
    'zh-cn': string;
    'ja': string;
  };
  icon: LucideIcon;
  available: boolean;
  comingSoon: boolean;
}

/**
 * 支援的語言代碼
 */
export type Locale = 'zh-tw' | 'en' | 'zh-cn' | 'ja';

/**
 * 支援的工具 slug
 */
export type ToolSlug = 'removebg' | 'compress' | 'crop' | 'convert';
