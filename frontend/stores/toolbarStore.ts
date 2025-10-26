import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 工具列位置介面
 */
export interface ToolBarPosition {
  x: number;
  y: number;
}

/**
 * 工具列狀態介面
 */
export interface ToolBarState {
  position: ToolBarPosition;
  isCollapsed: boolean;
  setPosition: (position: ToolBarPosition) => void;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

/**
 * 預設工具列位置（左側中間）
 */
const getDefaultPosition = (): ToolBarPosition => {
  if (typeof window === 'undefined') {
    return { x: 20, y: 200 }; // SSR 固定預設值
  }
  return {
    x: 20,
    y: Math.max(200, window.innerHeight / 2 - 150), // 減去工具列高度的一半，使其垂直居中
  };
};

/**
 * 工具列狀態管理 Store
 *
 * 功能：
 * - 管理工具列位置（x, y）
 * - 管理工具列收合狀態（isCollapsed）
 * - 使用 localStorage 持久化
 */
export const useToolBarStore = create<ToolBarState>()(
  persist(
    (set) => ({
      position: getDefaultPosition(),
      isCollapsed: false,

      setPosition: (position) => set({ position }),

      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: 'toolbar-storage', // localStorage key
      // 只持久化 position 和 isCollapsed
      partialize: (state) => ({
        position: state.position,
        isCollapsed: state.isCollapsed,
      }),
    }
  )
);
