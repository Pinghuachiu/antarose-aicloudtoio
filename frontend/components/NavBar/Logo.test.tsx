import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'zh-tw' }),
}));

describe('Logo', () => {
  it('應該渲染 Logo 組件', () => {
    render(<Logo />);

    const logo = screen.getByLabelText(/CloudTools AI/i);
    expect(logo).toBeInTheDocument();
  });

  it('應該顯示品牌名稱 "CloudTools"', () => {
    render(<Logo />);

    const brandName = screen.getByText('CloudTools');
    expect(brandName).toBeInTheDocument();
  });

  it('應該顯示 "AI" 標籤', () => {
    render(<Logo />);

    const aiLabel = screen.getByText('AI');
    expect(aiLabel).toBeInTheDocument();
  });

  it('應該包含 Sparkles icon', () => {
    const { container } = render(<Logo />);

    // Lucide icons 使用 SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('應該是一個可點擊的連結', () => {
    render(<Logo />);

    const link = screen.getByLabelText(/CloudTools AI/i);
    expect(link).toHaveAttribute('href');
  });

  it('應該連結到當前語言的首頁', () => {
    render(<Logo />);

    const link = screen.getByLabelText(/CloudTools AI/i);
    expect(link).toHaveAttribute('href', '/zh-tw');
  });

  it('應該有 hover 效果', () => {
    render(<Logo />);

    const link = screen.getByLabelText(/CloudTools AI/i);
    expect(link).toHaveClass('hover:opacity-80');
  });

  it('應該有正確的 aria-label', () => {
    render(<Logo />);

    const link = screen.getByLabelText('CloudTools AI - 返回首頁');
    expect(link).toBeInTheDocument();
  });
});
