'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { type Locale } from '@/locales';
import { TOOLS } from '@/lib/constants/tools';

/**
 * 移動端 Tab Bar 組件
 *
 * 設計規格：
 * - 固定在底部（fixed bottom-0）
 * - 高度 64px (h-16)
 * - 顯示所有 4 個工具
 * - 根據當前 URL 高亮對應工具
 * - 點擊工具可跳轉到對應頁面
 */
export function MobileTabBar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as Locale) || 'zh-tw';

  // 獲取當前工具的 slug
  const getCurrentTool = () => {
    const pathParts = pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  const currentTool = getCurrentTool();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 z-40 bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800">
      <div className="h-full px-2 flex items-center justify-around max-w-md mx-auto">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.slug;

          return (
            <Link
              key={tool.id}
              href={`/${locale}/${tool.slug}`}
              className={`
                flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all duration-200 flex-1
                ${isActive
                  ? 'text-primary-400'
                  : 'text-neutral-400 hover:text-neutral-200'
                }
                ${tool.comingSoon ? 'opacity-50' : ''}
              `}
              aria-label={`切換到${tool.name[locale]}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary-400' : ''}`}>
                {tool.name[locale]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
