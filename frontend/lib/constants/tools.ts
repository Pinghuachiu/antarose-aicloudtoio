import { ImageMinus, Minimize2, Crop, RefreshCw, type LucideIcon } from 'lucide-react';

/**
 * 工具定義介面
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
 * 工具列表定義
 *
 * 根據 spec.md 第 1.5 節定義
 */
export const TOOLS: Tool[] = [
  {
    id: 'removebg',
    slug: 'removebg',
    name: {
      'zh-tw': '去背',
      'en': 'Remove BG',
      'zh-cn': '去背',
      'ja': '背景削除'
    },
    icon: ImageMinus,
    available: true,
    comingSoon: false
  },
  {
    id: 'compress',
    slug: 'compress',
    name: {
      'zh-tw': '壓縮',
      'en': 'Compress',
      'zh-cn': '压缩',
      'ja': '圧縮'
    },
    icon: Minimize2,
    available: false,
    comingSoon: true
  },
  {
    id: 'crop',
    slug: 'crop',
    name: {
      'zh-tw': '裁切',
      'en': 'Crop',
      'zh-cn': '裁切',
      'ja': '切り取り'
    },
    icon: Crop,
    available: false,
    comingSoon: true
  },
  {
    id: 'convert',
    slug: 'convert',
    name: {
      'zh-tw': '轉換',
      'en': 'Convert',
      'zh-cn': '转换',
      'ja': '変換'
    },
    icon: RefreshCw,
    available: false,
    comingSoon: true
  }
];

/**
 * 可用工具列表
 */
export const AVAILABLE_TOOLS = TOOLS.filter(tool => tool.available).map(tool => tool.slug);

/**
 * Coming Soon 工具列表
 */
export const COMING_SOON_TOOLS = TOOLS.filter(tool => tool.comingSoon).map(tool => tool.slug);

/**
 * 根據 slug 獲取工具
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(tool => tool.slug === slug);
}

/**
 * 檢查工具是否可用
 */
export function isToolAvailable(slug: string): boolean {
  return AVAILABLE_TOOLS.includes(slug);
}

/**
 * 檢查工具是否為 Coming Soon
 */
export function isToolComingSoon(slug: string): boolean {
  return COMING_SOON_TOOLS.includes(slug);
}
