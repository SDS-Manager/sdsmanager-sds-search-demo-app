import { isIPadOS, shouldUseMobileSummaryView } from 'utils/mobileSummaryView';

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const IPAD_UA =
  'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1';
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36';
const MAC_SAFARI_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const WINDOWS_CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

interface Device {
  width: number;
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}

const NAVIGATOR_FIELDS = ['userAgent', 'platform', 'maxTouchPoints'] as const;

const setDevice = (device: Device): void => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => {
    const maxWidth = Number(/max-width:\s*(\d+)px/.exec(query)?.[1]);
    return {
      matches: device.width <= maxWidth,
      media: query,
    } as MediaQueryList;
  });
  NAVIGATOR_FIELDS.forEach((field) =>
    Object.defineProperty(window.navigator, field, {
      value: device[field],
      configurable: true,
    })
  );
};

afterEach(() => {
  // Drop the own properties so the next test reads jsdom's defaults again.
  NAVIGATOR_FIELDS.forEach(
    (field) =>
      delete (window.navigator as unknown as Record<string, unknown>)[field]
  );
});

describe('shouldUseMobileSummaryView (DIMA-1747)', () => {
  it.each<[string, Device]>([
    [
      'a narrow desktop window',
      {
        width: 375,
        userAgent: WINDOWS_CHROME_UA,
        platform: 'Win32',
        maxTouchPoints: 0,
      },
    ],
    [
      'the last width below the breakpoint',
      {
        width: 767,
        userAgent: WINDOWS_CHROME_UA,
        platform: 'Win32',
        maxTouchPoints: 0,
      },
    ],
    [
      'an iPhone in portrait',
      {
        width: 390,
        userAgent: IPHONE_UA,
        platform: 'iPhone',
        maxTouchPoints: 5,
      },
    ],
    [
      'an iPhone rotated to landscape (wider than 767px)',
      {
        width: 844,
        userAgent: IPHONE_UA,
        platform: 'iPhone',
        maxTouchPoints: 5,
      },
    ],
    [
      'an Android phone rotated to landscape',
      {
        width: 851,
        userAgent: ANDROID_UA,
        platform: 'Linux armv8l',
        maxTouchPoints: 5,
      },
    ],
    [
      'an iPad with an iPad UA',
      { width: 810, userAgent: IPAD_UA, platform: 'iPad', maxTouchPoints: 5 },
    ],
    [
      'an iPadOS 13+ iPad (desktop Mac UA, touch)',
      {
        width: 1180,
        userAgent: MAC_SAFARI_UA,
        platform: 'MacIntel',
        maxTouchPoints: 5,
      },
    ],
  ])('is true for %s', (_, device) => {
    setDevice(device);
    expect(shouldUseMobileSummaryView()).toBe(true);
  });

  it.each<[string, Device]>([
    [
      'a desktop Mac (no touch points)',
      {
        width: 1280,
        userAgent: MAC_SAFARI_UA,
        platform: 'MacIntel',
        maxTouchPoints: 0,
      },
    ],
    [
      'a desktop Windows browser',
      {
        width: 1280,
        userAgent: WINDOWS_CHROME_UA,
        platform: 'Win32',
        maxTouchPoints: 0,
      },
    ],
    [
      'a desktop window exactly at the breakpoint',
      {
        width: 768,
        userAgent: WINDOWS_CHROME_UA,
        platform: 'Win32',
        maxTouchPoints: 0,
      },
    ],
  ])('is false for %s', (_, device) => {
    setDevice(device);
    expect(shouldUseMobileSummaryView()).toBe(false);
  });
});

describe('isIPadOS', () => {
  it('needs both the MacIntel platform and more than one touch point', () => {
    setDevice({
      width: 1280,
      userAgent: MAC_SAFARI_UA,
      platform: 'MacIntel',
      maxTouchPoints: 5,
    });
    expect(isIPadOS()).toBe(true);

    setDevice({
      width: 1280,
      userAgent: MAC_SAFARI_UA,
      platform: 'MacIntel',
      maxTouchPoints: 0,
    });
    expect(isIPadOS()).toBe(false);
  });
});
