export interface ArenaEvent {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  status: "preparing" | "planned";
  color: string;
  contenders: string[];
  tags: string[];
  lore: string;
}
export const arenaEvents: ArenaEvent[] = [
  {
    id: "season-01",
    title: "Organic stupidity vs artificial intelligence",
    subtitle: "Neuro Fly vs GPT-6 Astra",
    type: "1 vs 1",
    status: "preparing",
    color: "mint",
    contenders: ["Neuro Fly", "GPT-6 Astra"],
    tags: ["Wetware", "Hardware"],
    lore: "One has a single brain cell. The other rents a billion. Somehow, this is a fair fight.",
  },
  {
    id: "touch-grass",
    title: "The touch grass incident",
    subtitle: "Terminally Online vs Actual Grass",
    type: "1 vs 1",
    status: "planned",
    color: "peach",
    contenders: ["Terminally Online", "Actual Grass"],
    tags: ["Screen time", "Photosynthesis"],
    lore: "A screen-addicted goblin discovers the outside. The outside has filed a restraining order. Concept only; no launch date or open pool.",
  },
  {
    id: "last-braincell",
    title: "The last brain cell",
    subtitle: "Doomscroller vs Reply Guy vs PDF Enjoyer",
    type: "Free-for-all",
    status: "planned",
    color: "pink",
    contenders: ["Doomscroller", "Reply Guy", "PDF Enjoyer"],
    tags: ["3 contenders", "0 research"],
    lore: "Three chronically online life forms. One functioning neuron. The PDF is 400 pages long. A planned three-way arena; rules are still in the oven.",
  },
  {
    id: "council",
    title: "Council of bad advice",
    subtitle: "Four experts, zero qualifications",
    type: "4-way chaos",
    status: "planned",
    color: "violet",
    contenders: ["Trust Me Bro", "Source: Vibes", "My Cousin", "The Algorithm"],
    tags: ["4 contenders", "Peer unreviewed"],
    lore: "The group chat has become sentient and wants to manage your life. Four-way concept; no real market, rewards or scheduled battle.",
  },
  {
    id: "printer",
    title: "Office final boss",
    subtitle: "Low Ink vs Unpaid Intern",
    type: "1 vs 1",
    status: "planned",
    color: "blue",
    contenders: ["Low Ink", "Unpaid Intern"],
    tags: ["Paper jam", "Emotional damage"],
    lore: "The document is black and white. The printer demands cyan. A workplace horror story waiting for its own arena.",
  },
  {
    id: "fridge",
    title: "3 AM fridge politics",
    subtitle: "Shredded Cheese vs Cold Pizza vs Tap Water",
    type: "Free-for-all",
    status: "planned",
    color: "yellow",
    contenders: ["Shredded Cheese", "Cold Pizza", "Tap Water"],
    tags: ["3 contenders", "No witnesses"],
    lore: "The kitchen light comes on. Diplomacy is over. A future snack-based spectacle with rules and launch timing still undecided.",
  },
];
