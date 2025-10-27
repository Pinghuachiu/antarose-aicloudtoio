import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HamburgerMenu } from './HamburgerMenu';
import { TOOLS } from '@/lib/constants/tools';

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('HamburgerMenu', () => {

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/zh-tw/removebg');
  });

  it('應該初始時顯示漢堡圖示', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    const button = screen.getByRole('button', { name: '開啟選單' });
    expect(button).toBeInTheDocument();
  });

  it('點擊後應該展開選單', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    const button = screen.getByRole('button', { name: '開啟選單' });
    fireEvent.click(button);

    // 選單應該出現
    const nav = screen.getByRole('navigation', { name: '行動版工具選單' });
    expect(nav).toBeInTheDocument();

    // 所有工具應該顯示
    TOOLS.forEach((tool) => {
      expect(screen.getByText(tool.name['zh-tw'])).toBeInTheDocument();
    });
  });

  it('展開後應該顯示關閉圖示', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    const openButton = screen.getByRole('button', { name: '開啟選單' });
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', { name: '關閉選單' });
    expect(closeButton).toBeInTheDocument();
  });

  it('點擊遮罩應該關閉選單', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    // 打開選單
    const button = screen.getByRole('button', { name: '開啟選單' });
    fireEvent.click(button);

    // 點擊遮罩
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/20');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);

    // 選單應該關閉
    expect(screen.queryByRole('navigation', { name: '行動版工具選單' })).not.toBeInTheDocument();
  });

  it('選擇工具後應該關閉選單', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    // 打開選單
    const button = screen.getByRole('button', { name: '開啟選單' });
    fireEvent.click(button);

    // 點擊可用的工具（去背）
    const availableTool = TOOLS.find((tool) => tool.available);
    if (availableTool) {
      const link = screen.getByText(availableTool.name['zh-tw']);
      fireEvent.click(link);

      // 選單應該關閉
      expect(screen.queryByRole('navigation', { name: '行動版工具選單' })).not.toBeInTheDocument();
    }
  });

  it('Coming Soon 工具應該無法點擊', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    // 打開選單
    const button = screen.getByRole('button', { name: '開啟選單' });
    fireEvent.click(button);

    // 找到 Coming Soon 工具
    const comingSoonTool = TOOLS.find((tool) => tool.comingSoon);
    if (comingSoonTool) {
      const link = screen.getByText(comingSoonTool.name['zh-tw']);
      expect(link.parentElement).toHaveClass('cursor-not-allowed');
      expect(link.parentElement).toHaveClass('opacity-60');
    }
  });

  it('應該根據 locale 顯示正確的語言', () => {
    render(<HamburgerMenu locale="en" />);

    // 打開選單
    const button = screen.getByRole('button', { name: '開啟選單' });
    fireEvent.click(button);

    expect(screen.getByText('Remove BG')).toBeInTheDocument();
    expect(screen.getByText('Compress')).toBeInTheDocument();
  });

  it('應該有正確的 aria 屬性', () => {
    render(<HamburgerMenu locale="zh-tw" />);

    const button = screen.getByRole('button', { name: '開啟選單' });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
