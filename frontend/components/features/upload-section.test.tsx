import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UploadSection } from './upload-section';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  upload: {
    selectFile: 'Select File',
    dragAndDrop: 'Drag and drop here',
    processing: 'Processing...',
    success: 'Success',
    error: 'Error',
  },
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
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="zh-TW" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

// Mock UploadCard and PreviewCanvas
vi.mock('./upload-card', () => ({
  UploadCard: ({
    onFileSelect,
    isProcessing,
  }: {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
  }) => (
    <div data-testid="upload-card">
      <button
        onClick={() => {
          const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
          onFileSelect(mockFile);
        }}
        disabled={isProcessing}
      >
        Upload File
      </button>
    </div>
  ),
}));

vi.mock('./preview-canvas', () => ({
  PreviewCanvas: ({
    onReset,
    isProcessing,
  }: {
    originalImage: string;
    processedImage: string | null;
    onDownload: (format: 'png' | 'jpg') => void;
    onReset: () => void;
    isProcessing: boolean;
  }) => (
    <div data-testid="preview-canvas">
      <button onClick={onReset} disabled={isProcessing}>
        Reset
      </button>
    </div>
  ),
}));

describe('UploadSection', () => {
  it('should render upload card initially', () => {
    renderWithIntl(<UploadSection />);

    expect(screen.getByTestId('upload-card')).toBeInTheDocument();
  });

  it('should not render preview canvas initially', () => {
    renderWithIntl(<UploadSection />);

    expect(screen.queryByTestId('preview-canvas')).not.toBeInTheDocument();
  });
});
