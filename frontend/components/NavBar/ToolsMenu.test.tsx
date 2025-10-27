import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolsMenu } from './ToolsMenu';
import { TOOLS } from '@/lib/constants/tools';

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('ToolsMenu', () => {

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/zh-tw/removebg');
  });

  it('應該渲染所有工具', () => {
    render(<ToolsMenu locale="zh-tw" />);

    TOOLS.forEach((tool) => {
      expect(screen.getByText(tool.name['zh-tw'])).toBeInTheDocument();
    });
  });

  it('應該高亮當前工具', () => {
    mockUsePathname.mockReturnValue('/zh-tw/removebg');
    render(<ToolsMenu locale="zh-tw" />);

    const removeBgLink = screen.getByRole('link', { name: /切換到去背/ });
    expect(removeBgLink).toHaveClass('bg-primary');
  });

  it('應該根據 locale 顯示正確的語言', () => {
    render(<ToolsMenu locale="en" />);

    expect(screen.getByText('Remove BG')).toBeInTheDocument();
    expect(screen.getByText('Compress')).toBeInTheDocument();
    expect(screen.getByText('Crop')).toBeInTheDocument();
    expect(screen.getByText('Convert')).toBeInTheDocument();
  });

  it('Coming Soon 工具應該顯示提示', () => {
    render(<ToolsMenu locale="zh-tw" />);

    // 檢查有 comingSoon 的工具
    const comingSoonTools = TOOLS.filter((tool) => tool.comingSoon);
    expect(comingSoonTools.length).toBeGreaterThan(0);

    comingSoonTools.forEach(() => {
      const soonLabels = screen.getAllByText('(Soon)');
      expect(soonLabels.length).toBeGreaterThan(0);
    });
  });

  it('應該有正確的 aria-label', () => {
    render(<ToolsMenu locale="zh-tw" />);

    const nav = screen.getByRole('navigation', { name: '工具選單' });
    expect(nav).toBeInTheDocument();

    TOOLS.forEach((tool) => {
      const link = screen.getByLabelText(`切換到${tool.name['zh-tw']}`);
      expect(link).toBeInTheDocument();
    });
  });

  it('應該有正確的 aria-current 屬性', () => {
    mockUsePathname.mockReturnValue('/zh-tw/removebg');
    render(<ToolsMenu locale="zh-tw" />);

    const activeLink = screen.getByRole('link', { name: /切換到去背/ });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });
});
