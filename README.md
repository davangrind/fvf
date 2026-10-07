# FVF / FeesVFees

An independent arena platform for Solana tokens launched on pump.fun. Communities choose sides and creator-fee contributions fuel their events. Neuro Fly versus GPT-6 Astra is the first rivalry.

Version 0.4 keeps the original paper, orange, green and blue visual identity. The homepage now opens with a large FVF mark, interactive fighters, Solana branding and a central contract / Swap card.

## Run

Node.js 22.12+ recommended.

```sh
npm ci
npm run dev
```

Open http://localhost:5173. The interface runs without a backend or API key.

```sh
npm run build
npm run preview
npm test
npm run test:e2e
```

## Publish the FVF purchase link

Once you have the official Solana mint, run this single PowerShell command (replace YOUR_CA):

```powershell
npm --prefix "E:\MyProjects\fvf" run publish:ca -- "YOUR_CA"
```

The command validates the address, requires a clean main branch, fast-forwards from GitHub, updates `src/config/token.json`, runs the production build, commits only the CA configuration and pushes to main. Vercel automatically builds and publishes it at https://fvf-six.vercel.app. The public site changes after that deployment completes, not at the instant the command is entered.

No Vercel CLI or token is needed. Existing Git credentials and Node.js 22.12+ are required. Failed builds restore the previous config. If a push fails, rerun the same command to retry the saved CA commit. Unrelated pending commits are not automatically published.

An empty or malformed address keeps Swap and Copy disabled. A configured address enables its exact `https://pump.fun/coin/<mint>` link. The published config takes precedence over `VITE_FVF_CA`; that environment variable remains an optional fallback while the tracked config is empty. Address validation checks its format, not ownership or onchain existence.

## Platform

- **Home** `/`: welcome scene, CA / Swap, metrics, leading tokens and upcoming events
- **Tokens** `/tokens`: 240 initial entries, search and sorting across the catalog, side filters, table / grid, 30 entries per page
- **Arena** `/arena`: one open preparation room and five locked concepts
- **First event** `/arena/season-01`: illustrated fighters, fee pools, evolution, skills, sound and history
- **Numbers** `/numbers`: fee chart, distribution, rankings and 486 initial incidents; load more, filter, pause and export
- **Field manual** `/docs`: 24 searchable chapters, interactive fee-flow diagram and Solana / pump.fun references
- **Launch** `/launch`: validate metadata and artwork, review and save a launch draft, then continue to pump.fun's creation page

Phantom connects through its Solana provider and reads a public key. Connecting never signs or submits a transaction. Guest access remains available. Changing accounts clears the session.

The draft handoff opens an empty pump.fun form. No automatic metadata transfer, mint creation or creator-fee routing is claimed.

## Data sources

The catalog, values, charts and activity remain a generated preview dataset. A single **DATA PREVIEW** link in the broadcast opens the data-source chapter. Repeated demo badges and public simulation controls have been removed. Source metadata remains in the data model and JSON exports.

The dataset contains 240 unique tokens, 486 starting activity records and 169 hourly history points. The adapter retains up to 1,000 events and 720 snapshots. No fabricated chain signatures or mint addresses are assigned to catalog records. Direct production launches fail closed until the integration is implemented.

## Preferences and persistence

- `fvf:solana:v1`: current catalog and fee history; custom records from `fvf:demo:v2` are carried forward on first load and older storage is left intact
- `fvf:draft:v3`: session launch draft
- `fvf:theme:v4`: dark by default; explicit light / dark selections persist
- `fvf:motion`: ambient motion preference
- `fvf:idea:*`: bookmarked future arenas

The dark edition is the default, including the initial HTML paint and unavailable-storage fallback. Old v3 theme defaults reset once; subsequent choices are remembered. Command/Control K opens search. Reduced motion is respected, sound starts off and icons are SVG. The original five evolution thresholds remain $0 / $25K / $75K / $150K / $250K. The full battle is still deferred.

## Vercel

Import this repository using the root directory. `vercel.json` builds with `npm run build`, publishes `dist/` and rewrites app routes to `index.html`. Use `npm run publish:ca -- YOUR_CA` to publish the mint through the same Git deployment flow. No environment-variable change is needed.

## Preserved releases

| Version | Branch | Tag |
| --- | --- | --- |
| Original prototype | [archive/v1-initial](https://github.com/0xchewa/fvf/tree/archive/v1-initial) | `v0.1.0-initial` |
| Laboratory redesign | [archive/v2-lab](https://github.com/0xchewa/fvf/tree/archive/v2-lab) | `v0.2.0-lab` |
| Restored platform design | commit `75fc518` | - |

See [Solana integration](docs/SOLANA-INTEGRATION.md), [validation](docs/VALIDATION.md) and [design](docs/DESIGN.md). Earlier protocol research under `research/` and `docs/archive/` is historical and is not current deployment configuration.
