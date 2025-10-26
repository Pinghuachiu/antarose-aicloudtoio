'use client';

import React from 'react';
import { DesktopToolBar } from './DesktopToolBar';
import { MobileTabBar } from './MobileTabBar';

/**
 * 工具列根組件 - 響應式切換
 *
 * 設計規格：
 * - 桌面端（≥768px）：顯示 DesktopToolBar
 * - 移動端（<768px）：顯示 MobileTabBar
 */
export function ToolBar() {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // 初始化檢測
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // 監聽視窗大小變化
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 避免 SSR hydration mismatch
  if (isMobile === null) {
    return null;
  }

  return (
    <>
      {/* 桌面端工具列 */}
      {!isMobile && <DesktopToolBar />}

      {/* 移動端 Tab Bar */}
      {isMobile && <MobileTabBar />}
    </>
  );
}
