import type {
  BattleSnapshot,
  BattleEvent,
  Faction,
  Token,
} from "../domain/types";
export function createSeed(now = Date.now()): BattleSnapshot {
  const raw: [string, string, Faction, string, number, number, number][] = [
    ["Brainrot", "BRAIN", "fly", "🧠", 1240000, 38750, 24.8],
    ["Blue Screen", "BSOD", "astra", "💾", 980000, 32100, 18.3],
    ["Lord of the Flies", "BUZZ", "fly", "🪰", 760000, 29420, 42.6],
    ["Clanker", "CLANK", "astra", "🤖", 641000, 26340, -3.2],
    ["Absolutely Cooked", "COOK", "fly", "🍳", 482000, 21600, 12.4],
    ["Skill Issue", "SKILL", "astra", "🎯", 389000, 18760, 8.7],
    ["Toxic Ex", "TOXIC", "fly", "☢️", 296000, 17900, -8.1],
    ["More RAM", "RAM", "astra", "🧊", 211000, 13420, 31.2],
    ["Wetware", "WET", "fly", "🧪", 175000, 12800, 6.9],
    ["Intern AGI", "INTERN", "astra", "🛸", 137000, 9160, 16.1],
    ["Definitely a Bug", "BUG", "fly", "🐛", 82400, 7950, 68.2],
    ["Ctrl Alt Defeat", "CTRL", "astra", "⚡", 64900, 5000, 10.4],
  ];
  const adjectives = [
    "Unemployed",
    "Terminal",
    "Certified",
    "Quantum",
    "Deep Fried",
    "Emotional",
    "Turbo",
    "Sleepy",
    "Caffeinated",
    "Unhinged",
    "Cosmic",
    "Overleveraged",
    "Digital",
    "Feral",
    "Sentient",
    "Forbidden",
    "Based",
    "Chronically Online",
    "Intergalactic",
    "Delusional",
    "Microwave",
    "Low Battery",
    "Financially Ruined",
  ];
  const nouns = [
    "Goblin",
    "Cat",
    "Intern",
    "Frog",
    "Toaster",
    "Rat",
    "Pigeon",
    "Potato",
    "Hamster",
    "Wizard",
  ];
  const codes = [
    "GOB",
    "CAT",
    "INT",
    "FROG",
    "TOAST",
    "RAT",
    "PIG",
    "SPUD",
    "HAM",
    "WIZ",
  ];
  const targets = { fly: 128420, astra: 104780 };
  for (const row of raw) row[5] = Math.floor(row[5] * 0.7);
  for (let i = 0; i < 228; i++) {
    const adjective = Math.floor(i / nouns.length);
    raw.push([
      adjectives[adjective] + " " + nouns[i % nouns.length],
      "S" + String(adjective + 1).padStart(2, "0") + codes[i % nouns.length],
      i % 2 === 0 ? "fly" : "astra",
      "",
      8500 + ((i * 7919 + 127) % 610000),
      0,
      Math.round((Math.sin(i * 2.19) * 32 + Math.cos(i * 0.7) * 17) * 10) / 10,
    ]);
  }
  for (const faction of ["fly", "astra"] as const) {
    const remaining =
      targets[faction] -
      raw.reduce((sum, row) => sum + (row[2] === faction ? row[5] : 0), 0);
    const additions = raw.slice(12).filter((row) => row[2] === faction);
    additions.forEach(
      (row, i) =>
        (row[5] =
          Math.floor(remaining / additions.length) +
          (i < remaining % additions.length ? 1 : 0)),
    );
  }
  const tokens: Token[] = raw.map(
    ([name, ticker, faction, emoji, marketCap, contribution, change], i) => ({
      id: `fvf-${ticker.toLowerCase()}`,
      name,
      ticker,
      faction,
      emoji,
      marketCap,
      contribution,
      change,
      image: "",
      description: `${name} has entered the chat. Every creator fee fuels ${faction === "fly" ? "the swarm" : "Astra"}. Questionable decisions. Excellent lore.`,
      createdAt: now - (72 + raw.length - i) * 3600000,
      source: "demo",
    }),
  );
  const total = (f: Faction) =>
    tokens
      .filter((t) => t.faction === f)
      .reduce((s, t) => s + t.contribution, 0);
  return {
    version: 1,
    source: "demo",
    tokens,
    endsAt: now + 222499000,
    fightStartedAt: null,
    phase: "preparing",
    result: null,
    sequence: 0,
    history: Array.from({ length: 169 }, (_, i) => ({
      at: now - (168 - i) * 3600000,
      fly: Math.round(
        total("fly") *
          (0.31 +
            i * (0.69 / 168) +
            Math.sin((i / 168) * 18) * 0.015 * (1 - i / 168)),
      ),
      astra: Math.round(
        total("astra") *
          (0.35 +
            i * (0.65 / 168) +
            Math.sin((i / 168) * 16) * 0.012 * (1 - i / 168)),
      ),
    })),
    events: (
      [
        ...Array.from({ length: 480 }, (_, i) => {
          const token = tokens[(i * 17 + 5) % tokens.length];
          const kind = (
            [
              "fees",
              "fees",
              "launch",
              "decision",
              "fees",
              "evolution",
              "lead",
              "fees",
            ] as const
          )[i % 8];
          const side = token.faction === "fly" ? "the swarm" : "Astra";
          const text =
            kind === "fees"
              ? `${token.ticker} fueled ${side} with ${24 + ((i * 37) % 480)}.`
              : kind === "launch"
                ? `${token.ticker} entered the arena. Another questionable decision.`
                : kind === "decision"
                  ? `${side === "Astra" ? "ASTRA" : "THE SWARM"}: ${["More RAM. Less empathy.", "The group chat is concerned.", "A new strategy has entered the chat."][i % 3]}`
                  : kind === "evolution"
                    ? `${side === "Astra" ? "ASTRA" : "THE SWARM"} logged an evolution milestone.`
                    : `${side === "Astra" ? "ASTRA" : "THE SWARM"} moved ahead in the fee race.`;
          return {
            id: `activity-${i}`,
            faction: token.faction,
            kind,
            text,
            at: now - 300000 - i * 317000,
            tokenId: token.id,
            source: "demo" as const,
          };
        }),
        {
          id: "seed-1",
          faction: "fly",
          kind: "fees",
          text: "$BRAIN fed $248 to the swarm. Brain food.",
          at: now - 14000,
          tokenId: "fvf-brain",
          source: "demo",
        },
        {
          id: "seed-2",
          faction: "astra",
          kind: "decision",
          text: "ASTRA installed more RAM. Still no empathy.",
          at: now - 38000,
          source: "demo",
        },
        {
          id: "seed-3",
          faction: "fly",
          kind: "evolution",
          text: "NEURO MENACE unlocked. It has opinions now.",
          at: now - 81000,
          source: "demo",
        },
        {
          id: "seed-4",
          faction: "astra",
          kind: "fees",
          text: "$BSOD delivered $420. Task failed successfully.",
          at: now - 128000,
          tokenId: "fvf-bsod",
          source: "demo",
        },
        {
          id: "seed-5",
          faction: "fly",
          kind: "lead",
          text: "THE SWARM took the lead. Science is concerned.",
          at: now - 187000,
          source: "demo",
        },
        {
          id: "seed-6",
          faction: "astra",
          kind: "launch",
          text: "$CTRL joined Astra. Humanity left on read.",
          at: now - 260000,
          tokenId: "fvf-ctrl",
          source: "demo",
        },
      ] as BattleEvent[]
    ).sort((a, b) => b.at - a.at),
  };
}
