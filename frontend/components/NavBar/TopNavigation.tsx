'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ToolsMenu } from './ToolsMenu';
import { HamburgerMenu } from './HamburgerMenu';
import { LanguageSwitcher } from '@/components/features/language-switcher';
import type { Locale } from '@/locales';

interface TopNavigationProps {
  locale: Locale;
}

/**
 * TopNavigation 組件 - 頂部導航欄
 *
 * 設計規格：
 * - 固定頂部（fixed top-0 z-50）
 * - 白色背景 + 淡陰影
 * - Logo（左）+ 工具選單（中，Desktop）+ 語言切換（右）
 * - 高度：Desktop 64px / Mobile 56px
 * - 響應式設計
 */
export function TopNavigation({ locale }: TopNavigationProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav"
      aria-label="主導航"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - 左側 */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="返回首頁"
          >
            {/* Icon */}
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary" strokeWidth={2} />

            {/* 品牌名稱 */}
            <div className="text-xl sm:text-2xl font-bold">
              <span className="text-text-heading">CloudTools</span>
              <span className="text-primary"> AI</span>
            </div>
          </Link>

          {/* 工具選單 - 中間（Desktop） */}
          <div className="hidden md:flex">
            <ToolsMenu locale={locale} />
          </div>

          {/* 右側區域 */}
          <div className="flex items-center gap-4">
            {/* 語言切換器 */}
            <LanguageSwitcher />

            {/* 漢堡選單（Mobile） */}
            <HamburgerMenu locale={locale} />
          </div>
        </div>
      </div>
    </nav>
  );
}
