# Version 3: original visual identity, platform hierarchy

## Direction

The original visual concept is restored: warm newsprint, ink borders, orange calls to action, condensed poster headings, Space Grotesk text, broadcast ticker, tilted status stamps, halftones and the original illustrated fighters. This is a restoration of the first edition's design, not a third visual concept.

The platform structure from version 2 remains. The homepage describes FVF and shows its metrics, tokens and event directory. Neuro Fly versus GPT-6 Astra is a compact event card there; the full illustrated scene belongs on its own event page.

The light paper edition is the default so the initial impression matches version 1. A dark edition retains the same typography, framing and orange accents. It does not reintroduce the mint/violet laboratory shell from version 2.

## Preserved elements

- Original font families, palette, brand mark, outlined buttons and offset hover shadows
- Original broadcast strip and paper-based section hierarchy
- Original fly and Astra illustrations, green/periwinkle stage, radial rays and halftone texture
- Original stage names, pool thresholds, power formula, skill tree and response lines
- SVG replacements for decorative Unicode symbols and token emoji
- Headings without trailing periods

`styles.css`, `classic-responsive.css` and `polish.css` preserve the original style foundation. `platform-layout.css` and `features.css` supply the additional page layouts; `platform.css` applies the restored identity to them. The final `responsive.css` handles the broader navigation and platform sections at smaller sizes.

## Platform hierarchy

| Route | Role |
| --- | --- |
| `/` | Platform explanation, launch action, metrics, top tokens, compact first event and planned concepts |
| `/tokens` | Searchable local token catalogue, table/grid layouts and sorting |
| `/arena` | Recruiting and planned events, with two-, three- and four-contender formats |
| `/arena/season-01` | The full first-event scene, fee pools, progression, skills and history |
| `/numbers` | Platform aggregates, fee chart, distribution, rankings and activity |
| `/docs` | 24 searchable documentation chapters with interactive fee flow |
| `/launch` | Open-event selection, faction choice, metadata, review and local creation |
| `/tokens/:id` | Local token record, contribution and attributable activity |

The event directory is a platform concept. Only the first arena is operational, and future cards remain explicitly locked. Their save action is a local bookmark, not a notification subscription.

## Interactions

Global search supports token names and tickers, pages, the open arena and manual chapter titles. It opens with the navigation control or Command/Control K, supports arrow keys and Enter, and closes with Escape.

The navigation remains sticky and becomes slightly shorter on scroll. Buttons use the original border and shadow feedback. The system cursor is unchanged. Sound is opt-in; ambient motion can be paused and reduced-motion settings are respected.

Clicking an illustrated fighter reveals a response. The fee simulation controls remain explicit and attributed to existing tokens. Stage changes alter scale, aura and equipment around the original illustration; the assets are not separately rigged models. Skills show descriptions and unlock thresholds. The actual longer battle remains deferred, without a fake imminent countdown.

The v2 articulated creatures, CRT character, draggable assistants, liquid tanks, mutation preview and memory game have been removed from the current interface.

## Data and integration

The tested local fee accounting, launch validation, file-signature checks and read-only wallet boundary remain. Existing `fvf:demo:v2` data is retained; theme and draft keys are versioned separately. Archived default-avatar references resolve to the restored illustrations.

Charts distinguish cumulative contributions from market-cap and illustrative token changes. There are no live prices, liquidity removal, production launches or payouts. The manual describes the current interface and the remaining production integration work.

## Archive and evidence

Version 1: branch `archive/v1-initial`, tag `v0.1.0-initial`, commit `ea431a3`.

Version 2: branch `archive/v2-lab`, tag `v0.2.0-lab`, commit `d5ab75e`. Its code, screenshots and validation remain accessible there.

The restoration was compared against the original desktop and mobile captures in `artifacts/screenshots/`. Current screenshots and checks are in `artifacts/v3/`.