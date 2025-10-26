import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavBar } from './NavBar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'zh-tw' }),
  usePathname: () => '/zh-tw/removebg',
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('NavBar', () => {
  it('應該渲染 NavBar 組件', () => {
    render(<NavBar />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('應該包含 Logo', () => {
    render(<NavBar />);

    const logo = screen.getByLabelText(/CloudTools AI/i);
    expect(logo).toBeInTheDocument();
  });

  it('應該包含語言切換器', () => {
    render(<NavBar />);

    // 語言切換器應該包含 Globe icon 和 Select 組件
    const languageSwitcher = screen.getByRole('combobox');
    expect(languageSwitcher).toBeInTheDocument();
  });

  it('應該固定在頂部', () => {
    const { container } = render(<NavBar />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed', 'top-0');
  });

  it('應該有正確的高度（64px）', () => {
    const { container } = render(<NavBar />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('h-16'); // h-16 = 64px
  });

  it('應該有正確的 z-index', () => {
    const { container } = render(<NavBar />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('z-40');
  });

  it('應該有模糊背景效果', () => {
    const { container } = render(<NavBar />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('backdrop-blur-sm');
  });

  it('應該有底部邊框', () => {
    const { container } = render(<NavBar />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('border-b', 'border-neutral-800');
  });
});
