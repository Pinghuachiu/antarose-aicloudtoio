import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSwitcher } from './language-switcher';

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/zh-tw',
  useParams: () => ({ locale: 'zh-tw' }),
}));

describe('LanguageSwitcher', () => {
  it('should render language switcher', () => {
    render(<LanguageSwitcher />);
    // The component should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should display globe icon', () => {
    render(<LanguageSwitcher />);
    const globeIcon = document.querySelector('svg');
    expect(globeIcon).toBeInTheDocument();
  });

  it('should not throw errors during render', () => {
    expect(() => {
      render(<LanguageSwitcher />);
    }).not.toThrow();
  });
});
