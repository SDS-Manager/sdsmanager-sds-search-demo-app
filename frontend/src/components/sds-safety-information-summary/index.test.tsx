import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import axiosInstance from 'api';
import SdsSafetyInformationSummary from 'components/sds-safety-information-summary';

jest.mock('api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
jest.mock('components/sds-safety-information-summary/MobilePdfPages', () => ({
  __esModule: true,
  default: ({ file }: { file: string }) => (
    <div data-testid="mobile-pdf-pages" data-file={file} />
  ),
}));

const BLOB_URL = 'blob:http://localhost/summary';
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

let viewportWidth = 1280;

const setDevice = (width: number, userAgent: string): void => {
  viewportWidth = width;
  Object.defineProperty(window.navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });
};

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: viewportWidth <= Number(/max-width:\s*(\d+)px/.exec(query)?.[1]),
    media: query,
  }));
  URL.createObjectURL = jest.fn(() => BLOB_URL);
  URL.revokeObjectURL = jest.fn();
  (axiosInstance.post as jest.Mock).mockResolvedValue({
    headers: { 'content-type': 'application/pdf' },
    data: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
  });
});

afterEach(() => {
  delete (window.navigator as unknown as Record<string, unknown>).userAgent;
  jest.clearAllMocks();
});

const searchSummary = (): void => {
  fireEvent.change(screen.getByLabelText('SDS ID'), {
    target: { value: '12286464' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));
};

describe('Safety Information Summary tab (DIMA-1747)', () => {
  it('shows pages and a Download button on a phone from the first render', async () => {
    setDevice(390, IPHONE_UA);
    render(<SdsSafetyInformationSummary />);
    searchSummary();

    expect(await screen.findByTestId('mobile-pdf-pages')).toHaveAttribute(
      'data-file',
      BLOB_URL
    );
    expect(document.querySelector('iframe')).toBeNull();
    const download = screen.getByRole('link', { name: /download pdf/i });
    expect(download).toHaveAttribute('href', BLOB_URL);
    expect(download).toHaveAttribute(
      'download',
      'safety-information-summary.pdf'
    );
  });

  it('keeps the iframe preview on desktop', async () => {
    setDevice(1280, DESKTOP_UA);
    render(<SdsSafetyInformationSummary />);
    searchSummary();

    await waitFor(() =>
      expect(document.querySelector('iframe')).toHaveAttribute('src', BLOB_URL)
    );
    expect(screen.queryByTestId('mobile-pdf-pages')).toBeNull();
    expect(screen.queryByRole('link', { name: /download pdf/i })).toBeNull();
  });

  it('switches to pages when a desktop window narrows below 768px', async () => {
    setDevice(1280, DESKTOP_UA);
    render(<SdsSafetyInformationSummary />);
    searchSummary();
    await waitFor(() =>
      expect(document.querySelector('iframe')).not.toBeNull()
    );

    viewportWidth = 600;
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(await screen.findByTestId('mobile-pdf-pages')).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });
});
