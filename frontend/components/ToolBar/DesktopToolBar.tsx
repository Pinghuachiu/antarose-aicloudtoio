'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Locale } from '@/locales';
import { TOOLS } from '@/lib/constants/tools';
import { useToolBarStore } from '@/stores/toolbarStore';

/**
 * 桌面端工具列組件
 *
 * 設計規格：
 * - 可自由拖動到畫面任意位置
 * - 支援收合/展開功能
 * - 顯示所有 4 個工具
 * - 根據當前 URL 高亮對應工具
 * - GPU 加速（使用 transform: translate3d）
 * - 使用 Zustand 狀態管理
 * - localStorage 持久化位置和收合狀態
 */
export function DesktopToolBar() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params.locale as Locale) || 'zh-tw';

  const { position, isCollapsed, setPosition, toggleCollapse } = useToolBarStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // 處理拖動開始
  const handleMouseDown = (e: React.MouseEvent) => {
    // 如果點擊的是連結或按鈕，不觸發拖動
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button')) {
      return;
    }

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    e.preventDefault();
  };

  // 處理拖動中
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStartPos.current.x;
    const newY = e.clientY - dragStartPos.current.y;

    setPosition({ x: newX, y: newY });
  };

  // 處理拖動結束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 監聽全局 mouse 事件
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // 獲取當前工具的 slug
  const getCurrentTool = () => {
    const pathParts = pathname.split('/');
    return pathParts[pathParts.length - 1];
  };

  const currentTool = getCurrentTool();

  return (
    <div
      id="draggable-toolbar"
      className={`fixed ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out select-none`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 30,
      }}
      onMouseDown={handleMouseDown}
    >
        <div className="glass-card p-3 shadow-2xl border border-neutral-700/50">
          {/* 收合按鈕 */}
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2 hover:bg-neutral-800 rounded transition-colors mb-2"
            aria-label={isCollapsed ? '展開工具列' : '收合工具列'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {/* 工具列表 */}
          <div className="space-y-1">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentTool === tool.slug;

              return (
                <Link
                  key={tool.id}
                  href={`/${locale}/${tool.slug}`}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-primary-500/20 border border-primary-500/50 text-primary-400'
                      : 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }
                    ${tool.comingSoon ? 'opacity-50' : ''}
                  `}
                  aria-label={`切換到${tool.name[locale]}`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {tool.name[locale]}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
  );
}
