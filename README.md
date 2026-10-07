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

## Configure the FVF purchase link

Copy `.env.example` to `.env.local` and set `VITE_FVF_CA` to the verified FVF Solana mint. Restart Vite, or rebuild / redeploy on Vercel after changing it. The mint is public configuration, not a secret.

Without a valid 32-byte base58 address, the card says the CA is coming soon and Swap / Copy are disabled. With a valid address, Swap opens `https://pump.fun/coin/<mint>` in a new tab. Format validation does not verify that the token exists or belongs to FVF; verify the mint before configuring it.

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
- `fvf:theme:v3`: paper / night edition
- `fvf:motion`: ambient motion preference
- `fvf:idea:*`: bookmarked future arenas

Command/Control K opens search. Reduced motion is respected, sound starts off and icons are SVG. The original five evolution thresholds remain $0 / $25K / $75K / $150K / $250K. The full battle is still deferred.

## Vercel

Import this repository using the root directory. `vercel.json` builds with `npm run build`, publishes `dist/` and rewrites app routes to `index.html`. Set `VITE_FVF_CA` in the appropriate Vercel environment once the official mint is available, then redeploy.

## Preserved releases

| Version | Branch | Tag |
| --- | --- | --- |
| Original prototype | [archive/v1-initial](https://github.com/0xchewa/fvf/tree/archive/v1-initial) | `v0.1.0-initial` |
| Laboratory redesign | [archive/v2-lab](https://github.com/0xchewa/fvf/tree/archive/v2-lab) | `v0.2.0-lab` |
| Restored platform design | commit `75fc518` | - |

See [Solana integration](docs/SOLANA-INTEGRATION.md), [validation](docs/VALIDATION.md) and [design](docs/DESIGN.md). Earlier protocol research under `research/` and `docs/archive/` is historical and is not current deployment configuration.
