import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserCheck } from './browser-check';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  browserCheck: {
    checking: 'Checking browser compatibility...',
    compatible: 'Your browser is compatible',
    notCompatible: 'Your browser is not compatible',
    recommendation: 'Please use Chrome, Edge, or Safari',
    unsupported: 'Unsupported browser',
    requireWebGL: 'Requires WebGL support',
    recommendBrowsers: 'We recommend using Chrome, Edge, or Firefox',
    downloadChrome: 'Download Chrome',
    downloadEdge: 'Download Edge',
    downloadFirefox: 'Download Firefox',
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="zh-TW" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('BrowserCheck', () => {
  it('should render browser check component', () => {
    renderWithIntl(<BrowserCheck />);
    // The component should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should not throw errors during render', () => {
    expect(() => {
      renderWithIntl(<BrowserCheck />);
    }).not.toThrow();
  });
});
