import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadCard } from './upload-card';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  upload: {
    selectFile: 'Select File',
    dragAndDrop: 'Drag and drop here',
    supportedFormats: 'Supported: PNG, JPG, WebP',
    maxFileSize: 'Max size: 10MB',
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="zh-TW" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('UploadCard', () => {
  const mockOnFileSelect = vi.fn();

  it('should render upload card with title and description', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} isProcessing={false} />);

    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop here')).toBeInTheDocument();
  });

  it('should show supported formats and max file size', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} isProcessing={false} />);

    expect(screen.getByText('Supported: PNG, JPG, WebP')).toBeInTheDocument();
    expect(screen.getByText('Max size: 10MB')).toBeInTheDocument();
  });

  it('should disable interactions when processing', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} isProcessing={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
