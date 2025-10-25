import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock next-intl useTranslations hook
vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useTranslations: (namespace: string) => {
      const allMessages: Record<string, Record<string, string>> = {
        'hero': {
          'title': 'AI 智能去背工具',
          'subtitle': '快速、免費、隱私安全',
          'description': '完全在瀏覽器本地運行，無需上傳圖片至伺服器',
        },
        'hero.features': {
          'privacy': '隱私安全',
          'privacyDesc': '所有處理都在本地進行',
          'fast': '快速高效',
          'fastDesc': '即時處理，無需等待',
          'free': '完全免費',
          'freeDesc': '無限次使用',
        },
        'steps': {
          'title': '使用步驟',
          'step1.title': '上傳圖片',
          'step1.desc': '選擇需要去背的圖片',
          'step2.title': 'AI 處理',
          'step2.desc': '智能識別並移除背景',
          'step3.title': '下載結果',
          'step3.desc': '下載去背後的圖片',
        },
        'footer': {
          'copyright': '© 2024 AI 去背工具',
          'links.about': '關於我們',
          'links.privacy': '隱私政策',
        },
      };

      return (key: string) => {
        const messages = allMessages[namespace];
        return messages?.[key] || key;
      };
    },
  };
});

// Mock components
vi.mock('@/components/features/upload-section', () => ({
  UploadSection: () => <div data-testid="upload-section">Upload Section</div>,
}));

vi.mock('@/components/features/browser-check', () => ({
  BrowserCheck: () => <div data-testid="browser-check">Browser Check</div>,
}));

vi.mock('@/components/features/language-switcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('HomePage', () => {
  it('should render hero section with title and description', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByText('AI 智能去背工具')).toBeInTheDocument();
    expect(screen.getByText('快速、免費、隱私安全')).toBeInTheDocument();
    expect(screen.getByText('完全在瀏覽器本地運行，無需上傳圖片至伺服器')).toBeInTheDocument();
  });

  it('should render language switcher', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('should render browser check component', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByTestId('browser-check')).toBeInTheDocument();
  });

  it('should render upload section', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByTestId('upload-section')).toBeInTheDocument();
  });

  it('should render features section with all features', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByText('隱私安全')).toBeInTheDocument();
    expect(screen.getByText('所有處理都在本地進行')).toBeInTheDocument();
    expect(screen.getByText('快速高效')).toBeInTheDocument();
    expect(screen.getByText('即時處理，無需等待')).toBeInTheDocument();
    expect(screen.getByText('完全免費')).toBeInTheDocument();
    expect(screen.getByText('無限次使用')).toBeInTheDocument();
  });

  it('should render steps section with all steps', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByText('使用步驟')).toBeInTheDocument();
    expect(screen.getByText('上傳圖片')).toBeInTheDocument();
    expect(screen.getByText('選擇需要去背的圖片')).toBeInTheDocument();
    expect(screen.getByText('AI 處理')).toBeInTheDocument();
    expect(screen.getByText('智能識別並移除背景')).toBeInTheDocument();
    expect(screen.getByText('下載結果')).toBeInTheDocument();
    expect(screen.getByText('下載去背後的圖片')).toBeInTheDocument();
  });

  it('should render footer section with copyright and links', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByText('© 2024 AI 去背工具')).toBeInTheDocument();
    expect(screen.getByText('關於我們')).toBeInTheDocument();
    expect(screen.getByText('隱私政策')).toBeInTheDocument();
  });

  it('should render footer links with correct hrefs', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    const aboutLink = screen.getByRole('link', { name: '關於我們' });
    const privacyLink = screen.getByRole('link', { name: '隱私政策' });

    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });

  it('should render step numbers correctly', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render feature icons', async () => {
    const params = Promise.resolve({ locale: 'zh-TW' as const });
    const component = await HomePage({ params });

    render(component);

    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });
});
