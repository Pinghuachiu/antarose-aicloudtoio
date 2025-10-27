'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS } from '@/lib/constants/tools';
import type { Locale } from '@/locales';

interface ToolsMenuProps {
  locale: Locale;
}

/**
 * ToolsMenu 組件 - 頂部導航工具選單
 *
 * 設計規格：
 * - 橫向顯示工具列表（去背、壓縮、裁切、轉換）
 * - 當前工具高亮（藍色背景）
 * - Hover 效果（淺灰背景）
 * - Desktop Only（Mobile 使用 HamburgerMenu）
 */
export function ToolsMenu({ locale }: ToolsMenuProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1" role="navigation" aria-label="工具選單">
      {TOOLS.map((tool) => {
        const isActive = pathname.includes(`/${tool.slug}`);
        const Icon = tool.icon;

        return (
          <Link
            key={tool.id}
            href={`/${locale}/${tool.slug}`}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              text-sm font-semibold
              transition-colors duration-200
              ${
                isActive
                  ? 'bg-primary text-white shadow-button'
                  : 'text-text-primary hover:bg-background-hover'
              }
              ${tool.comingSoon ? 'cursor-not-allowed opacity-60' : ''}
            `}
            aria-label={`切換到${tool.name[locale]}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={(e) => {
              if (tool.comingSoon) {
                e.preventDefault();
              }
            }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden lg:inline">{tool.name[locale]}</span>
            {tool.comingSoon && (
              <span className="text-xs opacity-70">(Soon)</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
