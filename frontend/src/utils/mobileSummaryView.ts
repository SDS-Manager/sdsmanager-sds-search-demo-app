/*
 * Device checks for the Safety Information Summary tab (DIMA-1747).
 *
 * Ported from the Inventory app (sds_inventory_mgr `utils/mobileSummaryView.ts`,
 * 1245xawd6ht), which fixed the same PDF-in-an-<iframe> problem there.
 */

const hasNavigator = (): boolean => typeof navigator !== 'undefined';

/** iPadOS 13+ reports a desktop Safari UA (`Macintosh`); touch points give it away. */
export const isIPadOS = (): boolean =>
  hasNavigator() &&
  navigator.platform === 'MacIntel' &&
  navigator.maxTouchPoints > 1;

/**
 * Whether the summary must render without a PDF `<iframe>`: Android Chrome
 * leaves it blank and iOS / iPadOS shows only the first page. The UA checks
 * keep the answer stable when a phone rotates to landscape and its width
 * passes 767px; desktop browsers at >= 768px keep the iframe preview.
 */
export const shouldUseMobileSummaryView = (): boolean => {
  if (window.matchMedia('(max-width: 767px)').matches) return true;
  if (!hasNavigator()) return false;
  return (
    /(iPad|iPhone|iPod)/.test(navigator.userAgent) ||
    /Android/.test(navigator.userAgent) ||
    isIPadOS()
  );
};
