# Version 2 validation

Completed 2026-09-20 in the Windows workspace. Browser checks used headless Chromium and WebKit, each with desktop and iPhone 13 emulation. These are engine and viewport checks, not a claim of testing on physical Apple hardware or the Safari application.

| Check | Result |
| --- | --- |
| TypeScript and production build | Passed with `npm run build` |
| Unit tests | 22 passed across 3 files |
| Production-browser E2E | 60 passed: 15 scenarios on each of 4 browser/device configurations |
| Route inspection | 16 page/viewport combinations; no runtime errors, trailing periods in headings or emoji-dependent symbols |
| Responsive overflow | 64 checks passed: 8 routes at 320, 360, 390, 600, 768, 1024, 1440 and 1920 px |
| Automated accessibility | 16 scans with no reported axe WCAG 2 A/AA or WCAG 2.1 AA violations: 8 routes in desktop dark and mobile light themes |
| Dependency audit | No known vulnerabilities reported in the full or production-only dependency audit |

The final E2E run targeted the compiled production preview at port 4173. The automated accessibility scan is not a complete manual accessibility certification.

## Scenarios exercised

- Main and mobile navigation, persistent dark/light theme, persistent motion preference, global search dialogs, and the scrolling header transformation
- Keyboard search for token profiles and deep-linked manual chapters; empty results and Escape dismissal
- Active versus locked arena concepts, filtering and local bookmarks
- Launch validation, explicit review, demo identity, local token creation, reload persistence and searchability
- Invalid artwork rejection and successful real WebP upload, including WebKit files without a MIME type
- Actual contribution-based evolution versus clearly labelled stage previews, skill inspection and effect previews
- Creature responses and keyboard movement of draggable assistants
- Memory sequence success, failure, retry and best-score persistence
- Token search, side filters, sorting, grid/table switching and no-results recovery
- Chart periods, activity filtering, pause/resume and labelled demo JSON export
- Full-content manual search, chapter anchors and the interactive fee-flow calculator
- Read-only wallet account/chain access, connection rejection and recovery to a demo identity
- OS reduced motion, legacy redirects, missing tokens, 404 routes and corrupt local storage

Unit coverage includes fee attribution, threshold boundaries, legacy deterministic resolution, production adapter rejection and image-format signature detection. The retained resolution model is not exposed as an active fight in version 2; the interface stays in preparation mode.

## Visual inspection and fixes

Reviewed desktop and mobile dark layouts, light homepages, the preparation scene at 320, 768 and 1440 px, maximum evolution previews and WebKit captures. The review corrected tablet character overlap, stacked the narrow-screen lab, improved light-theme contrast and ensured pausing motion leaves dialogs and newly mounted content visible.

Characters and icons use native vector elements with separately animated parts. Pointer decoration has no hit targets and is hidden for coarse pointers or reduced motion. Assistants also support keyboard movement. Sound starts off and requires a user action.

A real WebKit upload issue was corrected by identifying supported artwork from file signatures and validating decoded image content, instead of relying solely on the browser-provided MIME type.

## Reports and reproduction

- Screenshots and scene captures: `artifacts/v2/`
- Route checks: `artifacts/v2/inspection.json`
- Width matrix: `artifacts/v2/viewports.json`
- Accessibility results: `artifacts/v2/accessibility.json`
- Detailed browser report: `playwright-report/index.html` (generated and ignored by Git)

Run `npm test`, install browsers with `npx playwright install chromium webkit`, then run `npm run test:e2e`. Set `FVF_TEST_URL` to test a running production preview. The inspection and audit scripts are `scripts/inspect-v2.mjs` and `scripts/audit-v2.mjs`.

Initial application JavaScript is approximately 111 KB gzip, with secondary pages split into lazy chunks. Styles total approximately 18.3 KB gzip. Fonts are self-hosted.

Development URL: http://localhost:5173. Production preview: http://localhost:4173. Start them with `npm run dev`, or `npm run build` followed by `npm run preview`.

## Scope

Tokens, prices, fee pools, chart history and activity are local simulations. Wallet checks used an injected EIP-1193 mock; no signing, real funds, blockchain launch, Pons transaction, external indexer or settlement was involved. The longer fight is intentionally deferred.

The original release and its validation record remain on branch `archive/v1-initial` and tag `v0.1.0-initial`.