# FVF / FeesVFees

A playable, original frontend MVP for a faction-based pons launchpad. Launch a demo token, pick Zombie Neuro Fly or GPT-6 Astra, feed the war, and watch a complete final battle.

**Every token, pool, contribution, price, market cap, activity event and battle result is simulated locally. No blockchain transactions or payouts are implemented.** Browser-wallet connection only reads account access and chain ID. The independent fictional Astra character does not imply OpenAI affiliation.

## Run

Node.js 22.12+ recommended (developed with 22.19).

```sh
npm ci
npm run dev
```

Open **http://localhost:5173**. No API keys, database, external font requests, or environment variables are required.

```sh
npm run build
npm run preview
```

`dist/` is a static build. For a production static host, rewrite unknown application routes to `index.html` so deep links work. Buildability does not imply mainnet readiness.

## Deploy on Vercel

Import the GitHub repository into Vercel with the repository root as the Root Directory. The included `vercel.json` selects Vite, runs `npm run build`, publishes `dist/`, and rewrites application routes to `index.html` for working deep links. No environment variables are required for this demo.

The route configuration follows [Vercel's Vite SPA guide](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas). Deployment hosts the local demo; blockchain integration still requires the work described below.

## Try it

1. Open `/battle/season-01`. Click a fighter for a taunt.
2. Use **Simulate $25K in fees** to unlock stages and skill presentation.
3. Use **Fast-forward finale** to enter an eight-second warning, a nine-second clash, and the result. Restart the round to continue recruiting; existing demo recruits remain.
4. Open `/launch`, choose a faction, enter metadata, review fee routing, select **Use demo pilot**, and create a token. It appears in `/tokens`, its own detail page and `/activity`.
5. Search/filter/sort the arsenal, pause the activity view, or export the explicitly demo-tagged event JSON.

Local changes use `localStorage` key `fvf:demo:v1`; launch drafts use session storage key `fvf:draft`. Clearing site data resets the demo. If storage is unavailable/full, a notice explains that changes are session-only. Tabs have independent simulations; this is not a multi-user backend.

## Implementation

React 19, TypeScript, Vite, React Router, CSS animation, lightweight SVG charts, Lucide icons, self-hosted Barlow Condensed and Space Grotesk. Secondary routes load lazily. Original character art is generated via the built-in image generation tool and shipped as transparent WebP.

- `src/domain/`: typed models, accounting, validation, progression and replaceable battle resolver.
- `src/data/`: seeded local implementation and fail-closed production launch boundary.
- `src/components/`: arena, token/feed views, chart, wallet modal and layout.
- `src/pages/`: full product routes, including launch and documentation.
- `public/art/`: optimized original character assets. PNG masters are in `assets/source/`.
- `research/`: reference screenshots, text captures and read-only pons source snapshots.
- `artifacts/`: desktop/mobile screenshots and automated inspection reports.

## Validation

```sh
npm test
npx playwright install chromium
npm run test:e2e
node scripts/inspect.mjs
node scripts/accessibility.mjs
```

Browser scripts expect the dev server on port 5173. Playwright tests start it if needed. The scripts produce screenshots and JSON reports in `artifacts/`. Tests cover attribution, threshold boundaries, tie handling, replaceable resolution, persistence, duplicate launch prevention, closed-round behavior, form validation, artwork upload, wallet boundaries, search, progression, finale, reduced motion, errors and responsive overflow.

See [validation results](docs/VALIDATION.md), [design decisions](docs/DESIGN.md), [production pons integration requirements](docs/PONS-INTEGRATION.md), and [image prompts and asset provenance](docs/ART-PROMPTS.md).

## Production boundary

The pons V2 source and current creation flow were researched. No recipient addresses, deployed FVF treasury, metadata hosting, fee collector, indexer or verified transaction config were supplied. `PonsProductionAdapter` therefore throws before doing anything; there is no pretend live switch. Full integration requirements and precise source/code seams are documented in `docs/PONS-INTEGRATION.md`.

Financial settlement, prizes, audited smart contracts, full trading, developer buys, multi-user persistence, extra seasons, and additional character silhouettes are intentionally deferred.
