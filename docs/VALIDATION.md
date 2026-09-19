# MVP validation

Completed 2026-09-20 in the Windows workspace. Browsers ran headlessly through Playwright. Mobile results use Chromium with iPhone 13 emulation; this does not claim testing on a physical iPhone or Safari.

| Check                          | Result                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| TypeScript + production build  | Passed (`npm run build`)                                                                                 |
| Domain/adapter tests           | 19 passed, 2 files                                                                                       |
| Production-browser E2E         | 22 passed: 11 desktop + 11 mobile, against the compiled site on port 4173                                |
| Browser runtime/console errors | None across the tested routes                                                                            |
| Responsive overflow            | 42 checks passed: six pages × 320, 360, 390, 768, 1024, 1440, 1920 px                                    |
| Automated accessibility        | No reported axe WCAG 2 A/AA or WCAG 2.1 AA violations on six pages at 1440 and 390 px                    |
| Reduced motion                 | Ticker and character animation disabled; dialogs and battle flow remain available                        |
| Wallet boundary                | Account and chain reads only; no signing or transaction method invoked; rejection recovers to demo pilot |
| Dependency audit               | No known vulnerabilities reported after updating the test dependency; production-only audit also clean   |

Automated accessibility checks are not a complete manual accessibility certification. No real funds, deployed FVF contracts, Pons transaction, API indexer, or wallet extension was used. Browser wallet behavior was tested with an injected EIP-1193 mock, including rejection.

## User flows exercised

- Home faction CTA → correct preselected fighter.
- Required-field errors → valid metadata → faction-specific preview → explicit review → demo pilot → local launch → token profile → persistence after reload → searchable recruit.
- Artwork format rejection and valid local WebP upload.
- Faction filtering, name/ticker search, newest sort, no-results recovery.
- Fee attribution, exact evolution thresholds, skill unlocks, visual state change, warning, combat, deterministic winner, restart.
- Tie handling and substitution of a different outcome resolver without changing arena code.
- Duplicate-launch prevention and rejection after the round closes.
- Activity filtering, pause/resume and tagged demo JSON download.
- Mobile navigation, missing token recovery, deep links, 404, Escape dismissal, reduced motion.
- Corrupt/unavailable storage fallback and the fail-closed production adapter.

## Visual review and polish

Desktop and mobile screenshots were manually inspected. The polish pass separated fighter identity from character art on narrow screens, corrected tablet overlap, improved small-label and footer contrast, named the icon-only activity link, strengthened rays/halftones, and added explicit beam/collision states. Small-screen skill labels wrap instead of forcing horizontal scrolling.

Screenshots: `artifacts/screenshots/`. Latest inspection: `artifacts/inspection.json`. Width matrix: `artifacts/viewports.json`. Accessibility findings: `artifacts/accessibility.json`. Full browser results: `playwright-report/index.html` (generated; not part of the static app). Finale screenshots include warning, combat and winner states.

## Bundle and local URLs

- Initial application JS: approximately **96 KB gzip**; secondary page code is split into lazy chunks.
- Styles: approximately **15.5 KB gzip**.
- Both optimized original character assets: approximately **512 KB total**.
- Self-hosted Latin fonts; no external font fetches. PNG masters and research assets stay outside the static build.
- Development: **http://localhost:5173**.
- Built-site preview: **http://localhost:4173**.

The dev and preview processes were left running. On a new session, run `npm run dev`, or `npm run build` followed by `npm run preview`.
