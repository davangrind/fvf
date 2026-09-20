# Version 3 validation

Completed 2026-09-20 in the Windows workspace. Browser checks used headless Chromium and WebKit, each with desktop and iPhone 13 emulation. This does not claim testing on physical Apple hardware or the Safari application.

| Check | Result |
| --- | --- |
| TypeScript and production build | Passed with `npm run build` |
| Unit tests | 22 passed across 3 files |
| Production-browser E2E | 60 passed: 15 scenarios on 4 browser/device configurations |
| Route inspection | 16 page/viewport combinations without runtime errors, heading periods or emoji-dependent decoration |
| Responsive widths | 64 checks passed: 8 routes at 320, 360, 390, 600, 768, 1024, 1440 and 1920 px |
| Automated accessibility | 16 scans without reported axe WCAG 2 A/AA or WCAG 2.1 AA violations: 8 routes in desktop dark and mobile light themes |
| Dependency audit | No known vulnerabilities reported by npm after restoring the original fonts |

The E2E run targeted the compiled production preview on port 4173. Accessibility and visual inspection were refreshed after the final contrast and icon corrections. Automated accessibility scans are not a complete manual accessibility certification.

## User flows

- Persistent light/dark theme, motion preference, mobile navigation, global dialogs and the sticky scrolling header
- Keyboard search for tokens and manual chapters, empty results and Escape dismissal
- Platform-focused homepage, compact first-event preview, upcoming concepts and the complete event directory
- Active/locked event filtering, lore dialogs and persisted local bookmarks
- Launch validation, side selection, explicit review, demo identity, local creation, profile, reload persistence and search
- Invalid artwork rejection and valid local WebP upload in Chromium and WebKit
- Original fighter artwork, click responses and optional sound
- Fee contributions updating the actual stage, skill unlocks, scene and persisted local pools
- Token filters, sorting, grid/table views and no-results recovery
- Activity filters, pause/resume, demo JSON export and chart period controls
- All 24 manual chapters, full-content search, deep links and interactive fee flow
- Read-only wallet account/chain requests and recovery from rejection
- Reduced motion, legacy redirects, missing records, 404 and corrupt storage recovery

Unit coverage retains fee attribution, threshold boundaries, deterministic resolution rules, adapter boundaries and image signatures. The current interface stays in preparation mode and does not expose the deferred fight.

## Visual restoration

Compared the restored interface with the first release's saved desktop and mobile screenshots. The review confirmed the original typography, paper background, orange actions, ink borders, broadcast framing and character assets, alongside the platform hierarchy introduced in version 2.

Inspected desktop and mobile versions of Home, Arena, the first event, Tokens, Numbers, Launch, the manual and token profiles. Corrected a narrow-screen intro layout inherited from v1 and restored readable dark-theme contrast for form fields, secondary labels and the event feed.

SVG icons replace the original Unicode decoration and token emoji. The archived v2 creature assets are no longer referenced by the UI; old saved default avatar paths map to the original WebP illustrations. Sound remains opt-in and both ambient-motion pause and OS reduced motion work.

## Reports and reproduction

- Current screenshots: `artifacts/v3/`
- Route checks: `artifacts/v3/inspection.json`
- Width matrix: `artifacts/v3/viewports.json`
- Accessibility: `artifacts/v3/accessibility.json`
- Detailed E2E report: `playwright-report/index.html` (generated and ignored by Git)

Run `npm test`, install browsers with `npx playwright install chromium webkit`, then run `npm run test:e2e`. Set `FVF_TEST_URL` to a running production preview. Use `scripts/inspect-v3.mjs` and `scripts/audit-v3.mjs` for visual and accessibility checks.

Initial application JavaScript is approximately 110 KB gzip; styles are approximately 27 KB gzip. Secondary pages are lazy-loaded and fonts are self-hosted. The original optimized WebP character assets are reused.

Development: http://localhost:5173. Production preview: http://localhost:4173. Start with `npm run dev`, or `npm run build` followed by `npm run preview`.

## Boundaries and archives

No real funds, onchain launch, Pons transaction, indexer, payout or settlement was used. Wallet checks used an injected EIP-1193 mock. All financial-looking metrics remain local simulations.

The first version is preserved at `archive/v1-initial` / `v0.1.0-initial`. The complete laboratory redesign, including its code, screenshots and validation, is preserved at `archive/v2-lab` / `v0.2.0-lab` before this restoration.