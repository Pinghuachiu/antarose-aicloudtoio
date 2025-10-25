import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadCard } from './upload-card';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  upload: {
    selectFile: 'Select File',
    dragDrop: 'Drag and drop here',
    or: 'or',
    supportedFormats: 'Supported: PNG, JPG, WebP',
    maxSize: 'Max size: 10MB',
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

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('should render upload card with title and description', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} disabled={false} />);

    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop here')).toBeInTheDocument();
  });

  it('should show supported formats and max file size', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} disabled={false} />);

    expect(screen.getByText('Supported: PNG, JPG, WebP')).toBeInTheDocument();
    expect(screen.getByText('Max size: 10MB')).toBeInTheDocument();
  });

  it('should disable interactions when disabled', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should call onFileSelect when file is selected via input', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} disabled={false} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  it('should handle button click to trigger file input', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} disabled={false} />);

    const button = screen.getByRole('button');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Mock the click method
    const clickSpy = vi.fn();
    input.click = clickSpy;

    fireEvent.click(button);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not allow file selection when disabled', () => {
    renderWithIntl(<UploadCard onFileSelect={mockOnFileSelect} disabled={true} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
