# Version 2 design

## Direction

FVF is the platform, not the name of a single rivalry. The new structure keeps the homepage compact and moves the elaborate interactive scene into its own event page.

The visual language is a late-night laboratory with soft graphite surfaces, restrained mint and violet, strange hand-built vector organisms and dry internet humour. The light palette is a warm day-shift variant. DM Sans supplies readable product typography; Space Mono marks identifiers and small technical labels. There is no poster typography, orange framing or reused raster character art from version 1.

All interface icons use Lucide SVG or project-authored vector shapes. Decorative Unicode arrows, stars and emoji are absent. Headings have no trailing full stops. The top navigation becomes a narrower translucent rounded bar on scroll. Search, launch and wallet access remain global.

## References reviewed

[UsePaid home](https://usepaid.app/) informed the compact explanation, clear launchpad positioning, search and useful token/metric summaries. [Capital flow](https://usepaid.app/capital-flow) informed the idea of making the path of fees inspectable. Desktop and mobile captures from this pass live in `research/v2/`.

Those references informed information hierarchy. FVF uses its own artwork, palette, composition and copy. The flow does not inherit UsePaid’s payment destination, protocol split or exchange/off-ramp mechanics.

## Platform hierarchy

Home presents the platform before the first event. Tokens is the local asset catalogue. Arena separates a recruiting event from locked future concepts. Numbers owns metrics and activity. The manual groups 24 chapters into orientation, fee accounting, launch, lab interactions, analytics and implementation boundaries. The launch form exposes only the open experiment.

The event registry in `src/data/events.ts` is independent from the first event’s UI. It includes two-, three- and four-contender concepts. Only experiment 001 is operational. Upcoming cards are explicitly locked and their save action is a browser bookmark, not an external notification.

## Creatures and scene

Neuro Fly is a soft, slightly deranged biological creature with oversized asymmetric eyes. Its brain, pupils, wings, legs, cable, backpack, orbit and crown are independently drawn and animated. Astra is a deliberately different isometric CRT creature with a pixel face, antenna, articulated hands, USB-like tail, orbiting modules and halo.

`Creatures.tsx` supplies five visual stages for each participant. These are code-authored vector illustrations, not a 3D engine or externally generated character images. The lab uses CSS perspective, a receding floor grid, layered equipment and vector platforms to create a diorama.

Pool growth changes the actual stage and base equipment. A separate preview slider reveals future silhouettes without changing the account state. The skill tree includes eight descriptions and four effect families: swarm, neural pulse, overclock, shield, plus final ascension. Previews never imply an actual fight.

Assistants support pointer dragging, touch dragging and arrow-key movement. Poking creatures cycles their lines and plays optional faction-specific sounds. A sequence-memory toy adds a replayable nonfinancial interaction. Sound uses Web Audio; no external audio files or autoplay are required.

On phones the two labs stack vertically rather than compressing into an unreadable arena. The skill tree, previews and controls retain their own space. The actual longer battle has deliberately not been implemented in this version.

## Motion and accessibility

Buttons respond to hover and activation. Characters float and react; fluid surfaces and bubbles animate; flow diagrams show moving particles. The cursor glow and small connected points are decorative, do not replace the system cursor and never capture input.

A footer motion switch saves the user’s preference. Reduced-motion CSS removes animations, transition effects and pointer decoration. The memory toy still has discrete, user-initiated sequence cues. Sound defaults off.

Native dialogs provide modal focus handling and Escape dismissal. Controls have names independent of icon appearance. Search supports arrow keys and Enter; charts expose keyboard snapshot inspection; the manual supports text search and hash links.

## Honest data model

The main fee chart uses timestamps rather than evenly spacing irregular arrivals. Pool share is labelled separately from evolution fill. The tank is cumulative creator-fee contribution, not token liquidity. Seed token microcharts are clearly illustrative. New local tokens start at zero; the UI does not invent holders, volume or payouts.

The fee-flow calculator uses a plainly disclosed assumed 1% rate, not a production pons quote. Future protocol changes must distinguish accrued, claimable, claimed and received fees.

## Archive

Version 1 remains intact at branch `archive/v1-initial` and tag `v0.1.0-initial`. Its research captures and source PNGs remain available, but its styles and old rendered scene components are no longer imported in version 2.
