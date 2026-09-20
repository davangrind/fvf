export interface ManualChapter {
  id: string;
  group: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets?: string[];
}
export const manualChapters: ManualChapter[] = [
  {
    id: "start",
    group: "Start here",
    title: "A serious guide to unserious things",
    summary: "FVF in one minute",
    paragraphs: [
      "FeesVFees is a launchpad concept where tokens pick a side in internet spectacles. Instead of a token existing in isolation, its creator fees help a character, team or other participant develop inside a shared event. The token gives its community a home; the arena gives those communities something ridiculous to rally around.",
      "FVF is the platform. Neuro Fly versus GPT-6 Astra is its first experiment. Future events can have two, three or four participants, entirely different art, and their own rules. A future card is a concept, not an open market or a promise of a launch date.",
      "This release is an interactive local demo. You can create a token record, follow its contribution, mutate the creatures and explore the numbers without spending anything. There is no production launch, trading, settlement or payout in this build.",
    ],
    bullets: [
      "Launch gives a token an identity and a side",
      "Tokens lists every local recruit",
      "Arena is the directory of current and planned events",
      "Numbers explains the pools and activity",
      "This manual explains what happens and what does not",
    ],
  },
  {
    id: "quick-start",
    group: "Start here",
    title: "Your first five minutes",
    summary: "A guided lap around the petri dish",
    paragraphs: [
      "Open the Arena and enter experiment 001. Click either creature to hear its deeply unnecessary opinions. Turn sound on if you want the lab to bleep at you. Drag a lab assistant, or focus it and use your arrow keys. These interactions are toys; they do not transfer money or secretly alter your token.",
      "Pick a creature in the mutation lab. Try the evolution slider to see all five silhouettes. Previewing a stage changes only the display. Return to the actual stage to see what the current pool has unlocked. Open a skill to understand its unlock threshold and preview its effect.",
      "Use the clearly labelled demo fee controls to add an attributed contribution. Watch the matching tank, stage, chart and activity update together. Finally, launch a local token and find it through the global search. The Numbers page is a useful place to check what actually changed.",
    ],
  },
  {
    id: "events",
    group: "Start here",
    title: "One platform, many questionable events",
    summary: "How the arena directory works",
    paragraphs: [
      "Every event has an identity, participants and a lifecycle. The directory separates a recruiting event from a planned concept. A locked card can be opened to read its lore and saved in this browser, but it cannot receive tokens or fees. Saving is a local bookmark, not a subscription.",
      "The first event is a two-sided laboratory rivalry. The Touch Grass Incident is a proposed duel. The Last Brain Cell and 3 AM Fridge Politics propose three contenders. Council of Bad Advice proposes four. They demonstrate the breadth of the platform, not functioning additional markets.",
      "Production event rules must define who can join, when attribution starts, when it ends and how outcomes are resolved. Different event formats do not automatically share a winning formula. Those rules need to be published before contributions count.",
    ],
  },
  {
    id: "demo",
    group: "Start here",
    title: "What is real in this demo",
    summary: "The line between a working interface and a working protocol",
    paragraphs: [
      "The navigation, forms, local token creation, search, filters, theme preferences, charts, skill previews and interactive characters work in your browser. Fee contributions, market caps, percentage changes, activity and the starting history are simulated. Dollar values illustrate the interface; they are not live quotes or redeemable balances.",
      "A demo launch creates a local record with zero initial market cap and zero contributed fees. It does not mint a contract, charge gas or return a transaction hash. The seed tokens and their starting metrics are fictional. The simulator adds a small contribution every seven seconds while the tab is visible.",
      "Browser-wallet connection requests account access and reads the chain ID. It never requests a signature or a transaction. Connecting a wallet does not change the launch mode. No rewards, betting positions, guarantees or prize claims exist in this demo.",
    ],
  },
  {
    id: "fee-flow",
    group: "Follow the money",
    title: "Where the fees go",
    summary: "The whole idea, without the fog machine",
    paragraphs: [
      "The product concept is: a token joins an event; trading produces creator fees under the launch protocol; attributable fees reach the intended recipient; the event records a contribution; the appropriate participant progresses. Each step is distinct and needs its own evidence in production.",
      "Trading volume, trading liquidity, token market cap and creator fees are different quantities. The liquid in the tanks represents the cumulative creator-fee pool in this demo. It does not mean that trading liquidity has been removed from a pool or sent into a game.",
      "The interactive diagram below uses an assumed 1% rate to explain multiplication. It is not a quote of pons fees. Production fee rates, recipient permissions, settlement assets and claim mechanics must be obtained from the verified deployment and reflected accurately in the interface.",
    ],
  },
  {
    id: "attribution",
    group: "Follow the money",
    title: "Attribution before celebration",
    summary: "Which token fed which side",
    paragraphs: [
      "A contribution needs a token identity, event identity, participant, amount, denomination, source and timestamp. In the demo, the simulator chooses an existing token and adds its amount to that token’s contribution. The faction pool is the sum of the contributions of its tokens.",
      "The same attribution must be retained when funds share a recipient in production. A treasury balance alone cannot tell you which token funded which event. Transfers need to be reconciled with fee claims and protocol events, with duplicate processing prevented.",
      "The Numbers page groups contributions by side and lists source activity. Opening a token shows that token’s own contribution. A real indexer would need confirmation handling, reorg recovery, asset conversion rules and a clear explanation of corrections.",
    ],
  },
  {
    id: "accounting",
    group: "Follow the money",
    title: "Accrued is not received",
    summary: "Four words that save a lot of confusion",
    paragraphs: [
      "Accrued fees are fees recorded as earned by the protocol. Claimable fees can be collected under its rules. Claimed fees have left that accounting position. Received funds have arrived at the expected destination and been verified. Those are separate stages, not synonyms.",
      "The current tanks deliberately represent simulated cumulative contributions. They do not assert a verified treasury balance. In production, the display must choose and label the accounting stage that qualifies for event progression. A pending claim should not silently appear as a received contribution.",
      "If a fee arrives in a token denomination rather than the intended native asset, the system needs an explicit handling and valuation rule. No automatic conversion or exchange integration has been implemented here. A dollar equivalent would also need a timestamped pricing source.",
    ],
  },
  {
    id: "pools",
    group: "Follow the money",
    title: "Reading the suspicious liquid",
    summary: "A tank is a progress meter, not a savings account",
    paragraphs: [
      "Each participant has a cumulative fee pool. The tank’s fill level shows progress toward the final evolution threshold of $250,000 in simulated contributions. A label next to it shows the exact amount, current stage and next threshold. Pool totals can continue increasing after the visual tank reaches 100%.",
      "The shared split bar is different: it shows each side’s share of the combined event pool. A tank can be half full while its side has more than half of the total. Both values have useful meanings, and neither is a predicted chance of winning.",
      "The interface never promises that a contribution can be withdrawn, redeemed or paid back. Treasury custody, access control, disbursement and settlement are future protocol work. The current pools exist as local numbers in your browser.",
    ],
  },
  {
    id: "launch",
    group: "Make a token",
    title: "Launching your little problem",
    summary: "From idea to local recruit",
    paragraphs: [
      "Choose an event that is accepting recruits. At the moment, only Neuro Fly versus GPT-6 Astra is available. Pick a side, enter the token name and ticker, add a short description and optionally upload artwork. The preview updates with your draft.",
      "Review the event and the intended fee destination before confirming. The demo asks you to acknowledge that no onchain token will be created. You can use a demo pilot without a wallet. The launch button is protected against repeated clicks while the record is being created.",
      "After success, your token appears in Tokens, global search, the selected side’s roster and the activity log. New tokens begin with zero fee contribution. A successful form submission should not invent trading activity, market cap or a blockchain receipt.",
    ],
  },
  {
    id: "metadata",
    group: "Make a token",
    title: "Names, tickers and questionable artwork",
    summary: "What the form accepts",
    paragraphs: [
      "Token names accept 1–32 English letters, numbers and spaces. Tickers accept 1–10 uppercase letters or numbers. The lore field is required and allows up to 256 characters. These are demo input rules, not a claim about all pons protocol limits.",
      "Uploaded artwork must be a valid PNG, JPEG or WebP image under 2 MB. The browser reads and checks the image before showing it. Images are stored with your local token record; they are not uploaded to a public metadata host. The default creature avatar is available if you do not upload an image.",
      "Optional websites must use HTTPS. Optional X handles use letters, numbers and underscores up to 15 characters. A production launch needs durable metadata hosting, content validation and a clear association between the displayed metadata and the minted token.",
    ],
  },
  {
    id: "wallets",
    group: "Make a token",
    title: "Wallets without the jump scare",
    summary: "Exactly what connection does",
    paragraphs: [
      "Demo pilot mode creates an in-memory identity for this session. It needs no extension, account or funds. It is a convenient way to try the complete creation flow and is not a real address.",
      "Browser-wallet mode uses an injected EVM provider to request an account and read the current chain ID. No chain switch, message signature, token approval or value transfer is requested. If no provider is present or you reject access, the interface shows an error and leaves demo pilot available.",
      "Changing accounts or chains disconnects the displayed session so it does not continue showing stale account information. Production wallet support needs chain validation, transaction simulation and clear disclosures of the exact transaction being requested.",
    ],
  },
  {
    id: "token-profile",
    group: "Make a token",
    title: "A token gets its own corner",
    summary: "Profiles, rankings and what the numbers mean",
    paragraphs: [
      "A token profile contains its name, ticker, lore, chosen side, simulated market cap and attributed contribution. Its local identity is not a contract address. The corresponding arena link is the place to inspect the participant it supports.",
      "Token rankings can be sorted by contributed fees, simulated market cap or newest creation time. Search matches names and tickers; faction filters narrow the list. On the homepage, Biggest enablers ranks by cumulative contributed fees.",
      "Percentage changes and sparklines on seed tokens are illustrative demo data, not trading signals. The platform fee chart is separate and plots actual snapshots of the local simulation. A newly created token has no invented price history.",
    ],
  },
  {
    id: "creatures",
    group: "Inside the lab",
    title: "Meet the wetware and the hardware",
    summary: "Two creatures from completely different mistakes",
    paragraphs: [
      "Neuro Fly is a rubbery, exposed-brain insect with too much eye contact. Its wings, legs, face and brain move independently. Higher stages add a neural cable, a backpack and eventually a crown that nobody voted for. It is supported by small laboratory assistants.",
      "GPT-6 Astra is an old CRT monitor with a remarkably high opinion of itself. Its screen face, antenna, dangling cable, hands, orbiting chips and halo develop across the stages. The fictional character is independently created; it is not a product or endorsement from OpenAI.",
      "Click a creature to provoke a response. Movement, lines of dialogue and sound effects are local entertainment. There is no language-model call, remote conversation service or hidden gameplay purchase behind these interactions.",
    ],
  },
  {
    id: "evolution",
    group: "Inside the lab",
    title: "Evolution, unfortunately",
    summary: "Five stages of escalating concern",
    paragraphs: [
      "The current demo uses cumulative thresholds of $0, $25,000, $75,000, $150,000 and $250,000. Each threshold advances the corresponding participant by one stage. A contribution can cross multiple thresholds; the model is derived from the resulting pool rather than a separate progress counter.",
      "The mutation lab lets you preview every stage. Preview mode explicitly labels the model as a preview and does not alter the actual pool, unlocked stage or token metrics. Return to the actual stage when you want the model to follow the live simulation again.",
      "Actual threshold crossings change the character’s visible parts and the base’s equipment. A brief mutation effect marks the change. Animation is a visual cue; the amount and stage labels remain readable when motion is reduced or paused.",
    ],
  },
  {
    id: "skills",
    group: "Inside the lab",
    title: "A skill tree with questionable roots",
    summary: "Unlocks, demonstrations and future combat",
    paragraphs: [
      "Each side has four abilities corresponding to the four nonzero evolution thresholds. The skill tree shows unlocked and locked nodes, their required fee pool, and the selected skill’s description. Inspecting a locked node is allowed so you can understand what the next stage adds.",
      "Ability demonstrations are a sandbox. Previewing a swarm, a neural pulse, a shield or an overclock changes animation and audio, not real funds or a future result. Locked skills can be visually previewed, but are still shown as locked in the actual progression tree.",
      "The displayed power index is floor(pool × 0.72), a deterministic demo score. It is not a probability, payout quote or finalized combat stat. Combat balance, cooldowns, counterplay and the eventual multi-minute fight need their own design and validation.",
    ],
  },
  {
    id: "toys",
    group: "Inside the lab",
    title: "Things you can poke",
    summary: "The lab is allowed to be a little stupid",
    paragraphs: [
      "Drag the assistants around their lab zones. Mouse, touch and keyboard controls are supported: focus an assistant and use arrow keys to move it. A reset control puts the assistants back in their original positions. Their positions are local to the arena visit.",
      "The Brain Cell Check is a short memory toy. Watch a sequence of pads, then repeat it. Correct rounds extend the sequence; a mistake ends the run and lets you start again. Your best round is stored locally if browser storage is available.",
      "Sound is off by default. The sound control enables short synthesized effects after your interaction. Ambient motion can be paused from the footer, and your operating system’s reduced-motion preference is respected. None of the toys grants tokens or changes the fee accounting.",
    ],
  },
  {
    id: "battle",
    group: "Inside the lab",
    title: "Preparation now, battle later",
    summary: "Why the big red fight button is missing",
    paragraphs: [
      "This release focuses on recruitment, evolution, base interactions and ability previews. The actual fight is not implemented in the new interface. There is no countdown pretending that a production outcome is about to be decided.",
      "The arena stays in preparation mode while you experiment. Its purpose is to let us develop the characters, pacing, interactions and rules before building a longer spectacle. The old version remains archived as the first prototype.",
      "A future battle needs a published resolution method, explicit lock time, replayable inputs and a result that can be explained. Any financial settlement must be designed separately from the animation. Winning a visual sandbox demonstration does not create a payout obligation.",
    ],
  },
  {
    id: "numbers",
    group: "Read the room",
    title: "Numbers with their labels on",
    summary: "How to read the dashboard",
    paragraphs: [
      "The Numbers page combines cumulative creator fees, local token count, open event count, faction distribution, contribution rankings and activity. The chart derives from the simulation’s timestamped pool history. Hover it or use its arrow-key controls to inspect a snapshot.",
      "Time filters change the visible history. The retained history is bounded to the latest 100 snapshots, so All means all retained snapshots rather than an infinite archive. Seeded history provides an illustrative first day; later points record your actual local demo interactions.",
      "There are intentionally no invented holder counts, real trading volumes, realized yields or treasury balances. When production data exists, each new metric needs a definition and source before it is useful. A big number without a source is just typography.",
    ],
  },
  {
    id: "activity",
    group: "Read the room",
    title: "The incident log",
    summary: "Fees, recruits and spontaneous upgrades",
    paragraphs: [
      "Activity records simulated contributions, local launches, stage changes and changes in which side leads the pool split. Each event has a timestamp and a demo source label. Events associated with a token link back to that token’s profile.",
      "Use faction and event-type filters to narrow the feed. Pausing freezes the visible feed so you can inspect it; it does not stop the platform simulator or hide that the underlying state continues to change. Resuming shows the latest events again.",
      "Export downloads the currently displayed filtered records as JSON with an explicit demo source. The log retains up to 80 recent events. It is a convenient local inspection tool, not a production audit ledger or proof of payment.",
    ],
  },
  {
    id: "preferences",
    group: "Read the room",
    title: "Night shift, day shift",
    summary: "Make the chaos comfortable",
    paragraphs: [
      "The default night shift uses graphite surfaces and quieter mint and violet accents. The day shift uses a warm pale background and brighter colour. The animated creature switch in the navigation changes the theme, and the preference is saved locally.",
      "Desktop cursor decoration is deliberately subtle and never replaces the system cursor. It responds to interactive controls without intercepting clicks. Coarse-pointer devices do not run the pointer effect. Reduced-motion mode removes the decorative movement.",
      "Global search opens from the navigation or Command/Control K. It searches pages, local token names and tickers, the open arena and manual chapter titles. Use arrows and Enter for keyboard navigation; Escape closes the dialog.",
    ],
  },
  {
    id: "storage",
    group: "Under the hood",
    title: "Your browser is the demo database",
    summary: "Persistence and its limits",
    paragraphs: [
      "The new demo uses localStorage key fvf:demo:v2. Theme, motion, saved arena ideas and memory-toy best scores use separate fvf preference keys. Launch drafts use session storage. No token metadata or wallet address is sent to a backend by this application.",
      "Reloading in the same browser restores successfully stored records. Clearing site data removes them. Different devices and browser profiles have separate demos. Tabs run independent in-memory simulations, so this is not a collaborative backend and simultaneous edits are not reconciled.",
      "If storage is blocked or full, the application reports session-only behavior. A valid launch can still appear in the current session. Production needs a durable indexer and database, metadata hosting, synchronization and recovery rules. A screenshot of this demo is not a blockchain receipt.",
    ],
  },
  {
    id: "pons",
    group: "Under the hood",
    title: "The pons connection",
    summary: "A researched integration, not a deployed one",
    paragraphs: [
      "FVF is designed around the pons launchpad ecosystem on Robinhood Chain. The first prototype reviewed the official pons V2 source and creation flow. The production adapter is deliberately unavailable until the deployment, permissions and transaction parameters have been verified for the intended release.",
      "The researched factory interface includes a creator-fee recipient concept, but a configurable recipient does not by itself implement FVF. We still need an authorized recipient or treasury design, per-token attribution, event assignment and fee collection. Recipient transfer and protocol override behavior must be accounted for.",
      "The repository’s PONS-INTEGRATION document records the source references and outstanding verification. Addresses appearing in research are not presented as audited or verified FVF deployments. The interface does not ask you to send funds to an address copied from a design document.",
    ],
  },
  {
    id: "production",
    group: "Under the hood",
    title: "Before this gets real",
    summary: "The work between a demo and a protocol",
    paragraphs: [
      "A production release needs verified contracts and chain settings, a launch transaction builder, metadata hosting, wallet checks, an attributable fee collector, an indexer and a published event lifecycle. Treasury permissions and event outcome rules require independent review.",
      "The transaction flow must show what will happen before signing, handle rejected requests and failed transactions, wait for the required confirmations and distinguish pending from completed states. A local success screen is insufficient evidence of a successful chain transaction.",
      "Prizes, financial settlement, betting, cross-chain conversion, a platform token and buybacks are not implemented or promised. If any are introduced, their rules, risks and implementation must be explained separately. The current focus is a clear launchpad experience and a memorable interactive arena.",
    ],
  },
  {
    id: "glossary",
    group: "Under the hood",
    title: "A small dictionary of large mistakes",
    summary: "Terms you will see around the platform",
    paragraphs: [
      "Arena: an event with its own participants and rules. Participant or side: the character or team a token supports. Recruit: a token linked to a side. Creator fee: the protocol-defined fee attributable to a token creator or recipient. Contribution: an amount attributed to a token and counted toward its side’s pool.",
      "Pool: the cumulative contributed amount shown for a side. Stage: a threshold-derived evolution level. Skill: an ability associated with a stage. Sandbox preview: a visual demonstration that does not change accounting. Power index: the current demo formula derived from a pool.",
      "Market cap: an illustrative value on seed tokens, not pool size. Liquidity: assets used for trading, not a synonym for creator fees. Receipt: evidence of an operation; this demo only has local records. Planned: an idea with no open recruitment or committed release date. Brain cell: a scarce resource around here.",
    ],
  },
];
