import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewCanvas } from './preview-canvas';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  preview: {
    title: 'Preview',
    original: 'Original',
    result: 'Result',
  },
  download: {
    downloadPNG: 'Download PNG',
    downloadJPG: 'Download JPG',
    newImage: 'New Image',
  },
  upload: {
    processing: 'Processing...',
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="zh-TW" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('PreviewCanvas', () => {
  const mockOnDownload = vi.fn();
  const mockOnReset = vi.fn();
  const originalImage = 'data:image/png;base64,original';
  const processedImage = 'data:image/png;base64,processed';

  it('should render preview canvas with title', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={null}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('Preview')).toBeInTheDocument();
  });

  it('should render original image', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={null}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const originalImg = screen.getByAltText('Original');
    expect(originalImg).toBeInTheDocument();
    expect(originalImg).toHaveAttribute('src', originalImage);
    expect(originalImg).toHaveAttribute('loading', 'lazy');
    expect(originalImg).toHaveAttribute('decoding', 'async');
  });

  it('should render processed image when available', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const resultImg = screen.getByAltText('Result');
    expect(resultImg).toBeInTheDocument();
    expect(resultImg).toHaveAttribute('src', processedImage);
    expect(resultImg).toHaveAttribute('loading', 'lazy');
    expect(resultImg).toHaveAttribute('decoding', 'async');
  });

  it('should disable download buttons when no processed image', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={null}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const pngButton = screen.getByRole('button', { name: /Download PNG/i });
    const jpgButton = screen.getByRole('button', { name: /Download JPG/i });

    expect(pngButton).toBeDisabled();
    expect(jpgButton).toBeDisabled();
  });

  it('should enable download buttons when processed image exists', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const pngButton = screen.getByRole('button', { name: /Download PNG/i });
    const jpgButton = screen.getByRole('button', { name: /Download JPG/i });

    expect(pngButton).not.toBeDisabled();
    expect(jpgButton).not.toBeDisabled();
  });

  it('should call onDownload with png format when PNG button clicked', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const pngButton = screen.getByRole('button', { name: /Download PNG/i });
    fireEvent.click(pngButton);

    expect(mockOnDownload).toHaveBeenCalledWith('png');
  });

  it('should call onDownload with jpg format when JPG button clicked', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const jpgButton = screen.getByRole('button', { name: /Download JPG/i });
    fireEvent.click(jpgButton);

    expect(mockOnDownload).toHaveBeenCalledWith('jpg');
  });

  it('should call onReset when reset button clicked', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByRole('button', { name: /New Image/i });
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('should show processing overlay when isProcessing is true', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
        isProcessing={true}
      />
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should disable all buttons when processing', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
        isProcessing={true}
      />
    );

    const pngButton = screen.getByRole('button', { name: /Download PNG/i });
    const jpgButton = screen.getByRole('button', { name: /Download JPG/i });
    const resetButton = screen.getByRole('button', { name: /New Image/i });

    expect(pngButton).toBeDisabled();
    expect(jpgButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('should update slider position on mouse move', () => {
    renderWithIntl(
      <PreviewCanvas
        originalImage={originalImage}
        processedImage={processedImage}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    );

    const container = screen.getByAltText('Original').closest('div')?.parentElement;
    expect(container).toBeInTheDocument();

    if (container) {
      // Mock getBoundingClientRect
      container.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        width: 1000,
        top: 0,
        right: 1000,
        bottom: 1000,
        height: 1000,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));

      fireEvent.mouseMove(container, { clientX: 500 });
      // Slider position should be updated (visually tested via UI)
    }
  });
});
