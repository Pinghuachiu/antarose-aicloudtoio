import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopNavigation } from './TopNavigation';

// Mock components
vi.mock('./ToolsMenu', () => ({
  ToolsMenu: () => <div data-testid="tools-menu">ToolsMenu</div>,
}));

vi.mock('./HamburgerMenu', () => ({
  HamburgerMenu: () => <div data-testid="hamburger-menu">HamburgerMenu</div>,
}));

vi.mock('@/components/features/language-switcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">LanguageSwitcher</div>,
}));

// Mock next/navigation
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useParams: () => ({ locale: 'zh-tw' }),
  useRouter: vi.fn(),
}));

describe('TopNavigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/zh-tw/removebg');
  });

  it('應該渲染 Logo', () => {
    render(<TopNavigation locale="zh-tw" />);

    const logo = screen.getByRole('link', { name: '返回首頁' });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/zh-tw');
  });

  it('應該顯示品牌名稱', () => {
    render(<TopNavigation locale="zh-tw" />);

    expect(screen.getByText('CloudTools')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('應該渲染 ToolsMenu', () => {
    render(<TopNavigation locale="zh-tw" />);

    expect(screen.getByTestId('tools-menu')).toBeInTheDocument();
  });

  it('應該渲染 HamburgerMenu', () => {
    render(<TopNavigation locale="zh-tw" />);

    expect(screen.getByTestId('hamburger-menu')).toBeInTheDocument();
  });

  it('應該渲染 LanguageSwitcher', () => {
    render(<TopNavigation locale="zh-tw" />);

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('應該有固定定位和正確的 z-index', () => {
    const { container } = render(<TopNavigation locale="zh-tw" />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('top-0');
    expect(nav).toHaveClass('z-50');
  });

  it('應該有白色背景和陰影', () => {
    const { container } = render(<TopNavigation locale="zh-tw" />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('bg-white');
    expect(nav).toHaveClass('shadow-nav');
  });

  it('應該有正確的 aria-label', () => {
    render(<TopNavigation locale="zh-tw" />);

    const nav = screen.getByRole('navigation', { name: '主導航' });
    expect(nav).toBeInTheDocument();
  });

  it('應該支援不同語言的路由', () => {
    const locales = ['zh-tw', 'en', 'zh-cn', 'ja'];

    locales.forEach((locale) => {
      const { unmount } = render(<TopNavigation locale={locale as any} />);

      const logo = screen.getByRole('link', { name: '返回首頁' });
      expect(logo).toHaveAttribute('href', `/${locale}`);

      unmount();
    });
  });

  it('應該有響應式高度', () => {
    const { container } = render(<TopNavigation locale="zh-tw" />);

    const innerDiv = container.querySelector('.h-14');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass('sm:h-16');
  });
});
