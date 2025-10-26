'use client';

import React from 'react';
import { Logo } from './Logo';
import { LanguageSwitcher } from '@/components/features/language-switcher';

/**
 * NavBar 組件 - 頂部導航欄
 *
 * 設計規格：
 * - 固定在頂部（fixed top-0）
 * - 高度 64px (h-16)
 * - 全寬顯示
 * - 深色半透明背景，支援模糊效果
 * - z-index 層級較高，確保在其他內容之上
 * - 左側：Logo
 * - 右側：語言切換器
 */
export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-40 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo 區域 - 左側 */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* 右側區域 - 語言切換器 */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
