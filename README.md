# FVF / FeesVFees

An independent launchpad concept for pons. Tokens choose sides in community events; attributable creator fees fuel their progression. Neuro Fly versus GPT-6 Astra is the first event, not the identity of the platform.

**Version 3 restores the first release's visual language while retaining the expanded platform structure. This is a local interactive demo: tokens, market caps, fees, activity and history are simulated.**

## Run

Node.js 22.12+ recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:5173. No API keys, environment variables, backend or database are required.

```sh
npm run build
npm run preview
```

## Preserved versions

| Version | Branch | Tag | Commit |
| --- | --- | --- | --- |
| Original illustrated prototype | [archive/v1-initial](https://github.com/0xchewa/fvf/tree/archive/v1-initial) | `v0.1.0-initial` | `ea431a3` |
| Laboratory redesign | [archive/v2-lab](https://github.com/0xchewa/fvf/tree/archive/v2-lab) | `v0.2.0-lab` | `d5ab75e` |

Version 3 restores warm paper, ink borders, orange buttons, Barlow Condensed headings, Space Grotesk text, the original FVF mark, broadcast ticker and illustrated fighters. The v2 creatures, cursor network, liquid-tank scene, assistants and memory toy are archived with v2.

The paper edition is the default; an optional dark edition keeps the same graphic language. SVG icons replace emoji-dependent decoration, and headings have no trailing full stops.

## Platform sections

- **Home** `/`: platform introduction, launch action, metrics, top contributing tokens, a compact first-event card and upcoming concepts
- **Tokens** `/tokens`: search, faction filters, sorting, table/grid views and local token profiles
- **Arena** `/arena`: one recruiting event and five locked concepts, including three- and four-participant formats
- **First event** `/arena/season-01`: original illustrated arena, fee pools, supporting-token counts, evolution, skills, demo fee controls and history
- **Numbers** `/numbers`: cumulative fee chart, distribution, contributor rankings and filterable/pauseable activity with JSON export
- **Field manual** `/docs`: 24 searchable chapters covering the platform, event rules, fee accounting, launches, analytics and integration boundaries
- **Launch** `/launch`: event and side selection, draft, metadata, artwork validation, explicit review, demo identity and local token creation

Legacy `/battle/season-01`, `/activity` and `/explore` links redirect to their current destinations. Search, Launch and Connect wallet are available in the top navigation.

## Arena controls

Click a fighter for a response. Sound starts off and can be enabled from the event controls or footer. Inspect any skill node to see its description and threshold. Use the labelled **Simulate $25K in fees** button to add an attributed local contribution: its token, pool, stage, power, chart and activity update together.

Five stages are driven by the original $0 / $25K / $75K / $150K / $250K thresholds. The scene changes scale, aura and equipment around the original illustrations. The event stays in preparation mode; the longer fight remains deferred.

## Preferences and local data

Command/Control K opens global search. The header theme switch and footer motion control save their preferences. OS reduced motion is respected. Icons are SVG; the system cursor is retained.

- `fvf:demo:v2`: existing local tokens, contributions and retained history, preserved across the visual restoration
- `fvf:draft:v3`: session-only launch draft
- `fvf:theme:v3`: current edition's theme
- `fvf:motion`: ambient-motion preference
- `fvf:idea:*`: local bookmarks for planned events

Old default avatar references are mapped to the restored illustrations. Uploaded artwork stays with its token. Browsers and tabs have independent simulations. Storage failure falls back to session-only state; clearing site data removes local progress.

## Deploy on Vercel

Import this repository with the root as Root Directory. `vercel.json` selects Vite, builds with `npm run build`, publishes `dist/` and rewrites application routes to `index.html`. No environment variables are required for this demo.

## Validate

```sh
npm test
npx playwright install chromium webkit
npm run test:e2e
node scripts/inspect-v3.mjs
node scripts/audit-v3.mjs
```

E2E covers desktop/mobile Chromium and WebKit. Set `FVF_TEST_URL` to target a running production preview. Screenshots and audit results are under `artifacts/v3/`.

See [validation](docs/VALIDATION.md), [design](docs/DESIGN.md), [original artwork](docs/ART-PROMPTS.md) and [pons integration requirements](docs/PONS-INTEGRATION.md).

## Production boundary

The production adapter fails before submitting anything. Browser-wallet mode reads an account and chain ID; it does not sign, switch chains, approve spending or submit transactions. There is no real launch, trading, settlement or payout.

Production work requires verified deployment configuration, durable metadata hosting, a wallet transaction flow, an attributable fee collector, treasury design, an indexer, event lifecycle rules and independently reviewed resolution. No prizes, platform token, buybacks or financial returns are promised.