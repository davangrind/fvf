# FVF: pirate broadcast from a cartoon war room

The product is built around one question: who is getting fed? The arena is the homepage hero, not a link hidden below a marketing introduction.

## Visual decisions

- Warm newsprint, ink borders, condensed poster typography, vermilion calls to action. No glass surfaces or dark-dashboard shell.
- Radioactive green organic chaos versus periwinkle/cyan synthetic vanity. Two original hand-inked character assets share a comic language while remaining recognizable as silhouettes.
- Halftone panels, converging rays, orbiting machinery, a cutout VS burst, tilted status stickers and dry field notes establish a broadcast world.
- One shared territory split displays control. Fee pools, power, actual demo recruit counts and the countdown remain the primary data. Small explanatory labels explicitly mark simulation.
- Mobile retains both fighters side by side. Identity moves above the characters and each faction gets a compact stat grid and its own launch action. The full progression and war wire follow in one column.

## Product structure

| Route                       | Purpose                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `/`                         | What it is, current fight, leader, countdown, recruit actions, top contributors and activity |
| `/battle/season-01`         | Larger arena, skills, evolution controls, cinematic finale, fee history, lore                |
| `/launch`                   | Faction choice, artwork, metadata, preview, review and local demo launch                     |
| `/tokens` (also `/explore`) | Searchable and sortable arsenal with faction filters                                         |
| `/tokens/:id`               | Contribution, faction share, profile and attributable local activity                         |
| `/activity`                 | Event filters, paused view, JSON export, cumulative pool history                             |
| `/docs`                     | Short English field manual and transparent product boundaries                                |

There is no extra analytics route: the useful history lives beside the battle and the event feed. This avoids an empty dashboard section.

## Motion and interaction

Idle movement is compositor-friendly translate/rotate on a small number of elements. CSS handles rays, orbit sway, shadows, progression and combat beams; SVG handles the small history chart. No WebGL or animation runtime is loaded. Events update every seven seconds only while the document is visible. Timers use elapsed time, not frame counts.

Sound defaults off and is synthesized with Web Audio after opt-in. Character pokes, upgrades, lead changes and combat can bleep. Repeated poking reveals an alternate taunt. The arena link can be copied without posting to an external account.

The final fight progresses through warning, attacks, power swings and a winner overlay. Visual attacks never secretly change accounting. A separate resolver picks the deterministic demo outcome.

System reduced-motion disables idle, marquee, screen shake and combat motion; static state labels and the result remain. Native dialogs preserve focus and Escape behavior. Labels, alternative text, keyboard controls, empty/error states and contrast are included.

## Research findings

[UsePaid](https://usepaid.app/) provides a strong product structure: one obvious action supported by listings, evidence of activity, analytics and docs. Its desktop sidebar becomes compact mobile navigation; the launch form pairs metadata entry with an outcome preview. FVF uses that clarity with its own layout and art.

[Pepons](https://pepons.family/) earns identity through a persistent character, custom objects, lore, cursor reactions, and an intro that can be skipped. The world extends into its copy and footer. FVF takes the continuity principle, not its chrome materials or frog art.

[Hotdog](https://www.hotdogonrh.com/) carries one joke through its illustrated environment, ticker, membership card and receipt-style facts. Its mobile hero remains an intentional illustrated composition. FVF similarly gives data a place inside its fictional world.

Reference desktop/mobile screenshots and text captures are retained under `research/`. They are research artifacts and are not shipped in `public/`.

## Next stage

The two source illustrations are finished MVP assets. A future art pass could add separately rigged wings/drones and distinct hand-drawn silhouettes for all five stages. Current evolution is intentionally represented by size, aura, machinery, skills and stage identity. Additional seasons, full combat simulation, community chat, trading and payouts are outside this MVP.
