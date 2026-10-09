# Plan — Safety Information Summary tab usable on phones and tablets

Status: In progress (step 0 done) · Author: Nguyen Duc Nha · 2026-10-09
Task: DIMA-1747 — https://work.sdsmanager.com/task/DIMA-1747 (imported from ClickUp `1245xawd6hv`, read-only)
Branch: `bugfix/DIMA-1747` → `develop`

## Goal

On a phone or tablet, the **SDS Safety Information Summary** tab shows the generated PDF
as pages that fit the screen width and scroll to the last page, with a **Download PDF**
button. On desktop the tab looks and behaves exactly as today (500px `<iframe>`).

## Facts verified (2026-10-09, `origin/develop` 3b290a0)

- `components/sds-safety-information-summary/index.tsx` turns the POST response into a
  blob URL (:99) and shows it only in an `<iframe>` (:265-276). There is no mobile branch.
- The blob URL is revoked only when a new result replaces it (:100-105, :170-176) or when
  the tab unmounts (`TabPanel` renders only the active tab). A Download link inside the
  tab always points at a live URL.
- `pages/main/Main.tsx:91-106`: `<Tabs centered>`, standard variant. Standard tabs do not
  scroll (`overflowX: hidden`), and centred content that overflows is clipped on **both**
  sides. No URL parameter opens this tab (only `detail` / `upload`). Measured in step 0
  (Chromium, share of each tab visible on screen):

  | Viewport | Hidden or clipped tabs |
  |---|---|
  | 360–412px (phones) | SDS Search **0%**, SDS Details **0%**, Documentation **0%**, Newer revision 45–59%, **Summary 34–43%** |
  | 768–820px (tablets) | SDS Search **0%**, SDS Details 77–98%, Documentation 2–18% |
  | 1024px | SDS Search 78%, Documentation 82% |
  | ≥ 1100px | all fit (natural width ≈ 1012px, plus 40px of page padding) |

  So on a phone three tabs cannot be reached at all, not only the summary tab.
- A real summary PDF (staging, SDS 12286464, all sections) is **4 pages**, 115 KB.
- `public/index.html` sets `width=device-width`, so `matchMedia('(max-width: 767px)')`
  sees the real phone width.
- The same problem is already fixed in Inventory (1245xawd6ht, sds_inventory_mgr #1629),
  checked on real devices:
  - react-pdf `^5.3.2`, which resolves to 5.7.2. That version pins pdfjs-dist 2.12.313 and
    its peer range includes React 18.
  - The pdf.js worker loads from cdnjs.
  - `shouldUseMobileSummaryView()` (in `utils/mobileSummaryView.ts`) is called in the
    `useState` initialiser.
- `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.js` returns 200.
  nginx sets no CSP.
- No lockfile is committed, and the Dockerfile runs `npm install --legacy-peer-deps` on
  every build, so a new dependency needs no base-image rebuild. The react-pdf 5.x line
  ends at 5.7.2, so `^5.3.2` resolves the same way on every build.
- react-pdf 5 ships no types. With `strict: true`, the CRA build needs `@types/react-pdf`
  (5.7.4).
- The frontend has no tests yet (only `setupTests.ts`) and no frontend CI job, so tests
  run locally.
- PRs into `develop` auto-merge once the required checks pass
  (`.github/workflows/auto-merge.yml`). Drafts and PRs labelled `no-auto-merge` are
  skipped.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Phones and tablets: react-pdf pages plus a **Download PDF** button. Desktop: the iframe, unchanged. | Agreed 2026-10-09. Same experience as Inventory #1629. |
| D2 | "Mobile" is decided by `shouldUseMobileSummaryView()`, ported from Inventory: width `<768px`, **or** an iPhone/iPad/iPod/Android user agent, **or** iPadOS (`MacIntel` + touch). It is evaluated in the `useState` initialiser and again on `resize`. | Acceptance criterion: detection at first render. The user-agent check keeps a phone rotated to landscape on pages. |
| D3 | `react-pdf ^5.3.2` + `@types/react-pdf ^5.7.4`. Worker: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`. | Agreed: the same version Inventory verified on devices. Uses explicit `https:` rather than a protocol-relative `//` URL. |
| D4 | The react-pdf view goes in a new `MobilePdfPages.tsx`, loaded with `React.lazy`. | Desktop never downloads pdf.js, so it really is unchanged. `index.tsx` is already 281 lines, and code-style says to extract past ~200. |
| D5 | Text and annotation layers off (`renderTextLayer={false}`, `renderAnnotationLayer={false}`). | Canvas only: no react-pdf CSS to import, and less work on low-end phones. Download covers text selection. Inventory renders both layers without their CSS; this does not copy that. |
| D6 | Render every page; no lazy page rendering. | A real summary is 4 pages (step 0). Also checked with a 13-page PDF in step 6. |
| D7 | Download is `<Button component="a" href={pdfUrl} download="safety-information-summary.pdf">`. | Android saves to Downloads; iOS offers the save sheet. Inventory's button sets no file name (`aElement.download;` does nothing), and its stray `afterRen` / `options.workerSrc` props do nothing either. None of them are copied. |
| D8 | Tab bar below the width where all six tabs fit: `variant="scrollable"`, `scrollButtons="auto"`, `allowScrollButtonsMobile`, not centred. At or above that width: today's centred standard tabs. The width comes from `useMediaQuery(..., { noSsr: true })`, so it is correct on first render. The breakpoint is MUI's `lg` (1200px): the tabs fit from about 1052px (step 0), and the gap absorbs wider fonts on other platforms. Between 1052 and 1199px the tabs are left-aligned instead of centred. | Agreed 2026-10-09. This is outside the task's stated scope, but the tab has to be reachable on a phone. MUI does not allow `centered` and `scrollable` together. |

## Changes (frontend only)

| File | Change |
|---|---|
| `frontend/package.json` | Add `react-pdf ^5.3.2` (dependencies) and `@types/react-pdf ^5.7.4` (devDependencies). Do not commit a generated `package-lock.json`; none is tracked. |
| `frontend/src/utils/mobileSummaryView.ts` (new) | `isIPadOS()` and `shouldUseMobileSummaryView()`, ported from Inventory, with a comment pointing at DIMA-1747. |
| `frontend/src/components/sds-safety-information-summary/MobilePdfPages.tsx` (new) | `Document` with one `Page` per PDF page, sized to the container width (`Box` ref, `clientWidth`) and re-fit on `resize`. Shows a loading spinner, and on error: "The PDF can't be shown here — use Download PDF." |
| `frontend/src/components/sds-safety-information-summary/index.tsx` | Adds `isMobileView` state (lazy initialiser + resize listener). When `pdfUrl` is set: on mobile, the Download button plus `MobilePdfPages` inside `<Suspense>`; on desktop, the existing iframe block, unchanged. |
| `frontend/src/pages/main/Main.tsx` | Applies D8 to `<Tabs>`. |
| `frontend/src/utils/mobileSummaryView.test.ts` (new) | True for a narrow width, iPhone / Android / iPad user agents, and iPadOS (MacIntel + 5 touch points). False for a desktop Mac (0 touch points) and Windows at 1280px. |
| `frontend/src/components/sds-safety-information-summary/index.test.tsx` (new) | Mocks `matchMedia`, `URL.createObjectURL`, `api` and `MobilePdfPages`. Phone at first render, after Search: no `<iframe>`, the pages view receives the blob URL, and the Download link has `href` and `download`. Desktop: `<iframe src=blob>` and no Download button. Inventory had no test for first-render detection. |

## Steps

0. **Baseline, before any edit.** Run `npm install --legacy-peer-deps` in `frontend/`, then
   `npm start` with the Node heap capped. Use Playwright with the summary POST routed to a
   multi-page fixture PDF; the route also answers the CORS preflight and sends CORS
   headers.
   - Measure the tab bar's `scrollWidth` against `clientWidth` at 375 / 390 / 768 / 810 /
     1024 / 1280 / 1920px. This confirms or rules out the clipping and gives the D8
     breakpoint.
   - On desktop at 1280 and 1920: screenshot the tab bar and record the iframe's attributes.
1. Commit 1: this plan (`DIMA-1747 - Plan: summary tab usable on phones`).
2. Dependencies, then the util and its unit test (red → green).
3. `MobilePdfPages.tsx`, the `index.tsx` change, and the component test.
4. `Main.tsx` tab bar.
5. Local checks: `CI=true npx react-scripts test --watchAll=false`, `npx tsc --noEmit`, and
   `npm run build`. From the build output, note the size of the new lazy chunk and confirm
   the main bundle did not grow by pdf.js.
6. **Emulation run after the change**, on iPhone 13, Pixel 5, iPad (iPad user agent), iPadOS
   (Mac user agent + touch, with `navigator.platform` overridden), and desktop at 1280 and
   1920px:
   - **Phones and tablets:**
     - The summary tab can be reached and tapped.
     - There is no `<iframe>`, and the number of rendered pages equals the PDF's page count.
     - `documentElement.scrollWidth <= innerWidth`, and the last page scrolls into view.
     - After rotating to landscape, the pages re-fit and there is still no iframe.
     - Download fires a download event (Chromium).
   - **Desktop:**
     - The tab bar screenshot matches the baseline.
     - The iframe is present at 500px, and there is no Download button.
     - The react-pdf chunk is never requested.
   - Run WebKit too if `playwright install webkit` works locally. Otherwise this is
     Chromium only, and the PR says so.
7. Open the PR with the repo's `create-pr` skill. Body sections: `## Task`, `## Plan`,
   `## Description`, `## How to Test`, `## Manual steps` (None). The PR auto-merges into
   `develop` once checks pass, so open it only after steps 5–6 are green. Run the Codex
   loop (max 5 rounds); any pushback comments are drafted for the developer to post.
8. Stride comment with the PR link, drafted for the developer to post.

## How to Test (draft for the PR — staging-demo after merge)

First get an SDS ID from the **SDS Search** tab (e.g. search `acetone`). Without an API
key the demo allows 5 requests per minute per IP.

1. **Android Chrome phone.** Open staging-demo.sdsmanager.com. The tab bar scrolls
   sideways. Open **SDS Safety Information Summary**, paste the ID, and press Search.
   - ✅ Pages fill the width, there is no sideways scroll, and you can scroll to the last page.
   - ✅ After rotating the phone, it still shows pages, re-fitted.
   - ✅ Download PDF saves the file, and it opens.
2. **iPhone Safari.** Same steps.
   - ✅ Same results; Download offers the save sheet.
3. **iPad Safari.** Same steps.
   - ✅ Shows pages, not a PDF frozen on its first page.
4. **Desktop Chrome or Firefox, full-width window.**
   - ✅ The tab bar is centred as before.
   - ✅ The summary shows in the 500px PDF frame, with no Download button.
5. **Desktop with the window narrower than 768px.**
   - ✅ Switches to pages and the Download button.

## Risks

- **cdnjs worker blocked** (by an ad blocker or firewall): the error text shows and Download
  still works. Inventory has the same dependency.
- **Large PDFs on low-end phones** (iOS canvas memory): D5 reduces the load. The fallback
  for D6 is to render pages only as they scroll into view.
- **Node 24 locally vs Node 16 in Docker**: if CRA or Jest misbehave locally, run them
  under Node 16 (`npx -p node@16 …`).

## Out of scope

- The form fields (`xs={6}`) and the API-key box (`xs={3}`) stay as they are on phones:
  usable but cramped. Make a follow-up task if wanted.
- Other demo tabs, the backend / public API, and Inventory.
