# FVF / FeesVFees

An independent launchpad concept for pons: tokens choose sides in community events, and attributable creator fees fuel their progression. The platform supports an event directory; Neuro Fly versus GPT-6 Astra is its first playable preparation lab.

**Version 2 is a local interactive demo. Tokens, fees, market caps, activity and chart history are simulated. No onchain launch, trading, settlement or payout is implemented.**

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

## Version history

The complete first version is preserved on GitHub as branch [archive/v1-initial](https://github.com/0xchewa/fvf/tree/archive/v1-initial) and tag [v0.1.0-initial](https://github.com/0xchewa/fvf/tree/v0.1.0-initial), commit `ea431a3`. Version 2 replaces the visual language and page hierarchy while retaining the tested fee accounting and local launch boundary.

## Explore

- **Home** `/`: a short platform introduction, summary metrics, top contributing tokens and a compact open-arena preview
- **Tokens** `/tokens`: search, side filters, sorting, table/grid layouts and individual local token profiles
- **Arena** `/arena`: one recruiting event and five locked concepts, including three- and four-participant formats
- **Preparation lab** `/arena/season-01`: articulated vector creatures, liquid fee tanks, draggable assistants, five evolution stages per creature, eight skill previews and a memory toy
- **Numbers** `/numbers`: timestamped fee charts, pool share, contributor rankings, filterable/pauseable activity and tagged JSON export
- **Field manual** `/docs`: 24 searchable chapters, deep links, evolution thresholds and an interactive fee-flow explanation
- **Launch** `/launch`: draft, artwork, open-event selection, side selection, validation, explicit review, demo identity and local token creation

The old `/battle/season-01`, `/activity` and `/explore` links redirect to the corresponding new pages.

## Play with the lab

1. Poke each creature for a reaction. Sound is opt-in.
2. Drag an assistant, or focus it and use the arrow keys. Reset interns restores their positions.
3. Choose Fly or Astra in the mutation lab and scrub through all five stages. The preview is clearly separate from actual progression.
4. Inspect a skill and preview its effect, including locked future abilities. These are visual demonstrations.
5. Add a labelled demo fee contribution. The attributed token, side pool, model stage, base equipment, graph and activity update together.
6. Repeat the pad sequence in Brain cell check. Best round is saved locally; the toy never changes fees.
7. Launch a new local token and find it using global search.

The new release stays in preparation mode. The actual longer fight is intentionally deferred; there is no fake imminent battle or payout.

## Controls and data

Dark theme is the default. The navigation switch changes to light theme and saves the preference. Command/Control K opens global search. Footer controls toggle synthesized sound and ambient motion. OS reduced motion is respected, and pointer decoration is disabled on coarse-pointer devices.

All artwork in the new UI is native SVG/CSS, with independent animated parts and no emoji-dependent iconography. The first version’s PNG masters and WebP sprites remain archived in the repository but are not used by the new interface.

- `fvf:demo:v2`: local token records, contributions and retained history
- `fvf:draft:v2`: session-only launch draft
- `fvf:theme`, `fvf:motion`, `fvf:memory-best`: local preferences
- `fvf:idea:*`: local bookmarks for planned arena concepts

Different browsers and tabs have independent simulations. Storage failure falls back to session-only state. Clearing site data removes local progress.

## Deploy on Vercel

Import this GitHub repository with its root as the Root Directory. The included `vercel.json` selects Vite, runs `npm run build`, publishes `dist/` and rewrites application routes to `index.html`. No environment variables are required for this demo.

Routing follows [Vercel’s Vite SPA guide](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas). Hosting the demo does not enable blockchain functionality.

## Validate

```sh
npm test
npx playwright install chromium webkit
npm run test:e2e
node scripts/inspect-v2.mjs
node scripts/audit-v2.mjs
```

The E2E suite covers desktop/mobile Chromium and WebKit. `FVF_TEST_URL` can target a running production preview instead of the dev server. Screenshots and audit reports are generated under `artifacts/v2/`.

See [validation](docs/VALIDATION.md), [version 2 design](docs/DESIGN.md), and [pons integration requirements](docs/PONS-INTEGRATION.md).

## Production boundary

The production adapter fails before submitting anything. Browser-wallet mode reads an account and chain ID; it does not sign, switch chains, approve spending or submit a transaction.

Production work includes verified deployment configuration, durable metadata hosting, wallet transaction flow, an attributable fee collector, treasury design, an indexer, event lifecycle rules and independently reviewed resolution/settlement. No prizes, platform token, buybacks, cross-chain transfers or financial returns are promised.
