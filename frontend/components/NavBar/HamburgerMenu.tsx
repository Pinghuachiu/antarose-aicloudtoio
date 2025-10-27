'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { TOOLS } from '@/lib/constants/tools';
import type { Locale } from '@/locales';

interface HamburgerMenuProps {
  locale: Locale;
}

/**
 * HamburgerMenu 組件 - Mobile 漢堡選單
 *
 * 設計規格：
 * - Mobile Only（< 768px）
 * - 點擊展開工具選單
 * - 流暢動畫
 * - 選擇工具後自動關閉
 */
export function HamburgerMenu({ locale }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* 漢堡按鈕 */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-background-hover transition-colors"
        aria-label={isOpen ? '關閉選單' : '開啟選單'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-primary" />
        ) : (
          <Menu className="w-6 h-6 text-text-primary" />
        )}
      </button>

      {/* 展開選單 */}
      {isOpen && (
        <>
          {/* 遮罩層 */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* 選單內容 */}
          <div className="fixed top-14 left-0 right-0 bg-white border-b border-border shadow-card z-50 animate-in slide-in-from-top-2 duration-200">
            <nav className="max-w-7xl mx-auto px-4 py-4" role="navigation" aria-label="行動版工具選單">
              <div className="flex flex-col gap-2">
                {TOOLS.map((tool) => {
                  const isActive = pathname.includes(`/${tool.slug}`);
                  const Icon = tool.icon;

                  return (
                    <Link
                      key={tool.id}
                      href={`/${locale}/${tool.slug}`}
                      onClick={(e) => {
                        if (tool.comingSoon) {
                          e.preventDefault();
                        } else {
                          closeMenu();
                        }
                      }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        text-base font-semibold
                        transition-colors duration-200
                        ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-text-primary hover:bg-background-hover'
                        }
                        ${tool.comingSoon ? 'cursor-not-allowed opacity-60' : ''}
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tool.name[locale]}</span>
                      {tool.comingSoon && (
                        <span className="ml-auto text-xs opacity-70">(Coming Soon)</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
