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
      "FeesVFees brings Solana tokens into shared internet spectacles. Communities choose a side; creator-fee contributions fuel the arena. A token gets a home, a rivalry and a reason for its community to keep watching.",
      "FVF is the platform. Neuro Fly versus GPT-6 Astra is event 001. Future events can have two, three or four participants, their own aesthetics and entirely different rules. The directory separates open preparation from planned arenas.",
      "Start on Home, explore the token catalog, pick an arena and read its rules. Launch helps you prepare a token brief before continuing to pump.fun.",
    ],
  },
  {
    id: "quick-start",
    group: "Start here",
    title: "Your first five minutes",
    summary: "A guided lap around FVF",
    paragraphs: [
      "The welcome screen introduces FVF and the first rivalry. Its central CA card is reserved for the official FVF Solana mint. Swap opens that specific mint on pump.fun once its address has been announced.",
      "Explore Tokens by name, ticker, side, market cap or contributed fees. Switch between the table and cards, then use Previous and Next to move through the catalog. Each token links to its profile and chosen arena.",
      "Open the first arena to inspect the fighters, fee pools, stages and skills. Click a character for a response. Optional sound, night mode and motion controls are available across the site.",
    ],
  },
  {
    id: "events",
    group: "Start here",
    title: "One platform, many questionable events",
    summary: "How the arena directory works",
    paragraphs: [
      "Every arena groups a set of participants around a shared story. The arena defines its sides, progression, preparation state and eventual resolution rules. A token can support a participant without becoming the platform's entire identity.",
      "Neuro Fly versus GPT-6 Astra is the first open preparation room. The Touch Grass Incident, The Last Brain Cell, Council of Bad Advice and other proposed events are locked until their rules and launch details are ready.",
      "A planned card opens its lore and can be bookmarked in your browser. A bookmark is a personal preference, not a reservation, investment or registration for an upcoming launch.",
    ],
  },
  {
    id: "data",
    group: "Start here",
    title: "Data sources and availability",
    summary: "How to read the current release",
    paragraphs: [
      "The current catalog, market caps, percentage changes, pool history and activity are a generated preview dataset. They are not a live Solana feed, verified transactions, redeemable balances or confirmed launches. The DATA PREVIEW link beside the broadcast identifies this source across the site.",
      "The interface includes 240 catalog tokens, over 480 activity records and a week of starting fee history. Browser activity extends that dataset. Financial-looking numbers remain preview values even when the page is open or an arena is marked live; the arena badge describes the available interactive page.",
      "Launch saves a brief in this browser. Actual mint creation takes place on pump.fun, where you review its current terms and wallet request. Fee routing and indexing are not connected in this release. The FVF Swap link stays disabled until a valid official mint is configured. Connecting Phantom only requests account access.",
    ],
  },
  {
    id: "fee-flow",
    group: "Follow the money",
    title: "Where the fees go",
    summary: "The whole idea, without the fog machine",
    paragraphs: [
      "The intended path is token creation, trading, creator fees, verified attribution and arena progression. Each step represents a separate operation. A trade does not become an FVF contribution merely because a token's description mentions an arena.",
      "pump.fun distinguishes creator fees from protocol fees and liquidity-provider fees. Rates vary with market conditions, market stage and the applicable fee schedule. Use the current official fee page for the token you are examining.",
      "The calculator below uses an assumed 1% rate to explain the relationship between volume and fees. It is a worked example, not a current quote. Trading volume, market capitalization, liquidity and a participant's cumulative fee pool are different quantities.",
    ],
  },
  {
    id: "attribution",
    group: "Follow the money",
    title: "Attribution before celebration",
    summary: "Which token fed which side",
    paragraphs: [
      "A contribution needs a Solana mint, event, participant, verified recipient, amount, denomination and source transaction. Names and tickers are not unique and cannot establish a token's identity or fee destination.",
      "The production registry must verify the mint and relevant fee recipient before accepting a token. An indexer then links eligible fee transfers to the registered participant, with duplicate protection and a confirmation policy.",
      "If recipient permissions or destinations change, attribution needs to stop or be revalidated. Publishing the source and accounting state makes the fee history understandable and reviewable.",
    ],
  },
  {
    id: "accounting",
    group: "Follow the money",
    title: "Accrued is not received",
    summary: "Four words that save a lot of confusion",
    paragraphs: [
      "Accrued fees are not necessarily claimed fees. Claimed fees are not necessarily funds received by the participant's destination. FVF needs to define the accounting stage that counts toward progression for each event.",
      "Keep original asset quantities and timestamps alongside any USD conversion. Store SOL values as integer lamports and SPL amounts in the mint's base units. Price conversions require a named source and observation time.",
      "A production ledger must identify transfers by signature and instruction position, handle retries without double counting and reconcile indexed totals against the chain. A pool visualization is a view of that ledger, not an independent proof of funds.",
    ],
  },
  {
    id: "pools",
    group: "Follow the money",
    title: "Reading the fee pools",
    summary: "Cumulative contributions and event progress",
    paragraphs: [
      "The pool beneath each fighter shows cumulative creator-fee contributions attributed to that side. The split compares the two sides; it does not represent betting odds, ownership or a probability of winning.",
      "A token's share is its contribution divided by its side's total. Tokens on the same side cooperate to cross evolution thresholds, even when their individual names and communities are unrelated.",
      "USD labels are a common display denomination. The network is Solana; a dollar label does not imply that SOL is trading at one dollar or that a balance can be redeemed from the interface.",
    ],
  },
  {
    id: "launch",
    group: "Make a token",
    title: "Launching your little problem",
    summary: "From idea to local recruit",
    paragraphs: [
      "Choose an open event and a side, then enter a name, ticker, image and lore. Optional website and X links belong to the same token brief. Review the preview before saving.",
      "Save launch draft stores the brief and opens a completion screen. Continue on pump.fun opens its creation page with an empty form; transfer your chosen metadata there and review its transaction details in your wallet. Saving the FVF draft does not submit a mint transaction.",
      "After creation, FVF integration requires the verified Solana mint and an approved fee destination. A choice of side in a draft expresses your intended allegiance; it does not automatically change pump.fun fee routing.",
    ],
  },
  {
    id: "metadata",
    group: "Make a token",
    title: "Names, tickers and questionable artwork",
    summary: "What the form accepts",
    paragraphs: [
      "FVF draft names accept 1-32 English letters, numbers and spaces. Tickers accept 1-10 uppercase letters or numbers. Lore accepts up to 256 characters. These are form rules for this brief; pump.fun validates its own creation flow.",
      "Artwork may be PNG, JPEG or WebP, up to 2 MB. The form checks the file signature and that the image can be decoded. Changing sides preserves uploaded artwork; the default fighter illustration follows the selected side.",
      "Use links you control. A ticker can be copied by someone else, so always identify an actual Solana token by its mint address. The FVF record ID shown in a catalog profile is not a mint.",
    ],
  },
  {
    id: "wallets",
    group: "Make a token",
    title: "Wallets without the jump scare",
    summary: "Exactly what connection does",
    paragraphs: [
      "Connect Phantom uses Phantom's Solana provider. The wallet extension or mobile wallet controls the account permission request. FVF displays the selected public key once access is granted.",
      "Account changes or wallet disconnection clear the displayed session so an old address is not left connected in the interface. Disconnect also asks the provider to end its connection.",
      "Guest mode lets you browse and prepare drafts without an extension. It is a browser session rather than a blockchain address. Swaps and token creation on pump.fun use that site's separate wallet and transaction flow.",
    ],
  },
  {
    id: "token-profile",
    group: "Make a token",
    title: "A token gets its own corner",
    summary: "Profiles, rankings and what the numbers mean",
    paragraphs: [
      "A token profile collects its name, ticker, lore, side, market cap, change and attributed contribution. Its activity links the token to the larger arena story. The displayed record ID identifies this catalog entry.",
      "Search works across all entries, not just the current page. The token directory supports side filters and sorting by fees, market cap or newest creation. Pagination shows 30 entries per page in both table and grid views.",
      "The homepage ranks the five largest contributors. New saved drafts begin with zero market cap and zero contribution and show no invented trading chart. Their metadata can be revisited from the catalog.",
    ],
  },
  {
    id: "first-arena",
    group: "The first arena",
    title: "Neuro Fly versus GPT-6 Astra",
    summary: "Event 001, not the entire platform",
    paragraphs: [
      "A lab fly ate the wrong server. The server took it personally. Neuro Fly represents wetware, instinct and the swarm. GPT-6 Astra represents hardware, optimization and an unreasonable amount of confidence.",
      "Each side has its own illustration, pool, supporters, progression and skill tree. Click the characters for reactions, inspect a skill or choose a side for a new launch brief.",
      "The fictional Astra character is independently created. FVF is not affiliated with or endorsed by OpenAI. This arena's preparation room is the first event on a platform built for many different stories.",
    ],
  },
  {
    id: "evolution",
    group: "The first arena",
    title: "Evolution, unfortunately",
    summary: "Five stages of escalating concern",
    paragraphs: [
      "Each side advances through five stages at $0, $25K, $75K, $150K and $250K in cumulative contributions. Crossing a threshold changes the stage name and visual treatment of the fighter.",
      "The scene adds scale, aura and equipment as the fighter evolves. Progress toward the next stage appears beneath the character and in its evolution panel.",
      "Evolution belongs to the participant rather than one token. Every attributed contribution on that side affects the same progression total. The final threshold completes the current preparation progression.",
    ],
  },
  {
    id: "skills",
    group: "The first arena",
    title: "A skill tree with questionable roots",
    summary: "Unlocks, progression and future combat",
    paragraphs: [
      "Skill nodes show an ability name, its unlock threshold and whether the current stage has reached it. Clicking a node explains that ability even when it is still locked.",
      "The first arena's skills give context to evolution and character personality. Combat balance, cooldowns and interactions between skills belong to the upcoming battle rules.",
      "The displayed power index is a game score derived from the fee pool. It is not a financial return, a payout quote or a probability of winning.",
    ],
  },
  {
    id: "interactions",
    group: "The first arena",
    title: "Controls in the arena",
    summary: "Small interactions with clear effects",
    paragraphs: [
      "Click Neuro Fly or Astra to provoke a response. The home scene and the full arena both react to interaction. Character motion makes the preparation room feel occupied while remaining optional.",
      "The footer sound toggle enables short synthesized feedback after user interaction. Sound starts off. Use the adjacent motion toggle to pause ambient animations; the interface also respects your system's reduced-motion preference.",
      "Skill inspection, fee-history periods, token filters, global search and theme switching work with keyboard controls. Interactive elements retain focus outlines; the menu collapses on smaller screens.",
    ],
  },
  {
    id: "battle",
    group: "The first arena",
    title: "Preparation now, battle later",
    summary: "Why the big red fight button is missing",
    paragraphs: [
      "Preparation is available now. A resolved, multi-minute combat sequence is a separate feature. The page does not announce a fake imminent battle deadline.",
      "Before combat opens, each arena needs published inputs, lock time, resolution rules and an explainable result. A preparation power score alone cannot establish those rules.",
      "Future rounds may introduce entirely different characters and progression. An event's visual story does not promise betting, settlement, prizes or token returns.",
    ],
  },
  {
    id: "numbers",
    group: "Read the room",
    title: "Numbers with their labels on",
    summary: "How to read the dashboard",
    paragraphs: [
      "Numbers brings together platform metrics, cumulative fee history, side distribution, contributor rankings and the incident log. Each metric describes a separate dimension of activity.",
      "The fee chart supports one hour, 24 hours and all retained history. Hover or use its left and right arrow keys to inspect individual timestamped snapshots. All covers up to 720 retained snapshots.",
      "The distribution ring compares the Fly and Astra pools for event 001. Rankings order tokens by attributed creator fees. Neither chart is a price prediction.",
    ],
  },
  {
    id: "activity",
    group: "Read the room",
    title: "The incident log",
    summary: "Fees, recruits and spontaneous upgrades",
    paragraphs: [
      "The incident log groups contributions, launches, decisions, evolutions and lead changes. Entries associated with a token link back to that profile. Recent records appear first.",
      "Filter by participant or event type. Load more reveals 30 additional matching records. Pause freezes the current view for inspection; resuming returns to the latest state.",
      "Export downloads all matching records, including those beyond the visible page, as JSON. The file retains its source metadata and export timestamp. The browser stores up to 1,000 events.",
    ],
  },
  {
    id: "preferences",
    group: "Read the room",
    title: "Paper edition, night edition",
    summary: "Make the chaos comfortable",
    paragraphs: [
      "The paper edition uses warm surfaces, orange highlights, green wetware and blue hardware. Night mode darkens the surrounding interface while preserving the rivalry's colors.",
      "Your theme and motion choices are remembered in the browser. The sound toggle remains under your control. The header compacts as you scroll and expands again at the top.",
      "Global search opens with the search button or Control/Command plus K. Search pages, tokens, open arenas and manual chapters; use arrow keys and Enter to open a result.",
    ],
  },
  {
    id: "storage",
    group: "Under the hood",
    title: "Your saved settings and drafts",
    summary: "Browser storage and persistence",
    paragraphs: [
      "Drafts, preferences, bookmarked arena ideas and the current catalog state are stored in your browser. Reloading the same profile restores successfully saved data; another device has its own state.",
      "If browser storage is unavailable, the interface keeps working for the session and displays a storage notice. Clearing site data removes browser records. A saved launch brief is not a backup of a blockchain account.",
      "This edition keeps older storage intact and carries forward saved custom token records into the Solana catalog. A production indexer and account-backed persistence are separate infrastructure.",
    ],
  },
  {
    id: "pump",
    group: "Under the hood",
    title: "Solana meets pump.fun",
    summary: "The network and the launchpad",
    paragraphs: [
      "FVF now targets Solana and the pump.fun ecosystem. Solana identifies an SPL token by its mint public key. pump.fun provides the external creation and token trading pages linked from FVF.",
      "The homepage Swap destination is built only from the configured FVF mint, never from a token name or guessed address. The address is checked as a 32-byte base58 public key before enabling the link. Format validation alone does not establish ownership or authenticity.",
      "The official pump.fun fee schedule defines creator, protocol and liquidity-provider fees. Rates and program behavior must be checked against the relevant market before enabling production fee attribution. The links below are the primary references.",
    ],
  },
  {
    id: "production",
    group: "Under the hood",
    title: "The production connection",
    summary: "From the interface to verified chain data",
    paragraphs: [
      "Production launch integration needs verified program instructions, mint registration, metadata storage, recipient policy and explicit wallet transaction review. The current direct mint adapter stays unavailable until these are implemented.",
      "The accounting service needs confirmed chain ingestion, exact amounts, duplicate protection, a replayable ledger and reconciliation. Public metrics should switch to indexed records only once their source is verified.",
      "Set the official FVF mint to enable its purchase link, then verify the address and resulting pump.fun page. That configuration enables an external link; it does not activate the fee indexer or minting integration.",
    ],
  },
  {
    id: "glossary",
    group: "Under the hood",
    title: "A small dictionary of large mistakes",
    summary: "Terms you will see around the platform",
    paragraphs: [
      "Mint: the Solana public key identifying a token. SOL: Solana's native asset. SPL token: a token issued through the Solana token programs. CA: the familiar shorthand used here for a token's mint address.",
      "Creator fee: the portion of a trade's fees assigned under the applicable creator-fee rules. Pool: cumulative contributions shown for an arena participant. Stage: an evolution level reached at a contribution threshold. Skill: an ability associated with that progression.",
      "Market cap: token valuation based on price and supply. Liquidity: assets available to facilitate trading. Record ID: the catalog identifier shown by FVF. Planned: a future arena with no open preparation or committed release date. Brain cell: scarce around here.",
    ],
  },
];
