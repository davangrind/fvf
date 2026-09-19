import type { BattleSnapshot, Faction, Token } from "../domain/types";
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
  const tokens: Token[] = raw.map(
    ([name, ticker, faction, emoji, marketCap, contribution, change], i) => ({
      id: `demo-${ticker.toLowerCase()}`,
      name,
      ticker,
      faction,
      emoji,
      marketCap,
      contribution,
      change,
      image: "",
      description: `${name} has entered the chat. Every simulated creator fee feeds ${faction === "fly" ? "the swarm" : "Astra"}. Questionable decisions. Excellent lore.`,
      createdAt: now - (raw.length - i) * 3600000,
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
    history: Array.from({ length: 25 }, (_, i) => ({
      at: now - (24 - i) * 3600000,
      fly: Math.round(
        total("fly") * (0.31 + i * 0.02875) +
          (i === 24 ? 0 : Math.sin(i * 1.4) * 1800),
      ),
      astra: Math.round(
        total("astra") * (0.35 + i * 0.0270833) +
          (i === 24 ? 0 : Math.cos(i) * 1500),
      ),
    })),
    events: [
      {
        id: "seed-1",
        faction: "fly",
        kind: "fees",
        text: "$BRAIN fed $248 to the swarm. Brain food.",
        at: now - 14000,
        tokenId: "demo-brain",
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
        tokenId: "demo-bsod",
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
        tokenId: "demo-ctrl",
        source: "demo",
      },
    ],
  };
}
