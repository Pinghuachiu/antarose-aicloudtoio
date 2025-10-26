'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { type Locale } from '@/locales';

/**
 * Logo 組件 - 顯示品牌 Logo 和名稱
 *
 * 設計規格：
 * - 使用 lucide-react 的 Sparkles icon（暫時，等待 Lisa 設計建議）
 * - 顯示「CloudTools AI」品牌名稱
 * - 可點擊連結到首頁
 * - 響應式字體大小
 */
export function Logo() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'zh-tw';

  return (
    <Link
      href={`/${locale}`}
      className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
      aria-label="CloudTools AI - 返回首頁"
    >
      {/* Icon - 使用 Sparkles（暫時） */}
      <div className="relative">
        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary-500" strokeWidth={2} />
        <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full" />
      </div>

      {/* 品牌名稱 - 移動端簡化顯示 */}
      <div className="flex flex-col">
        <span className="text-base md:text-lg font-bold text-neutral-100 leading-tight">
          CloudTools
        </span>
        <span className="text-xs font-medium text-primary-500 leading-tight">
          AI
        </span>
      </div>
    </Link>
  );
}
