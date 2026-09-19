import type {
  BattleResolver,
  BattleSnapshot,
  Faction,
  LaunchInput,
} from "./types";
export const FACTIONS = {
  fly: {
    name: "Zombie Neuro Fly",
    short: "THE SWARM",
    cta: "Feed the swarm",
    motto: "No thoughts. Only biomass.",
    stages: [
      "Suspicious egg",
      "Brain parasite",
      "Neuro menace",
      "Hive mind",
      "Extinction event",
    ],
    skills: ["Wing it", "Brain rot", "Hive mind", "Biohazard mode"],
  },
  astra: {
    name: "GPT-6 Astra",
    short: "ASTRA",
    cta: "Join Astra",
    motto: "Your extinction is processing.",
    stages: [
      "Hello, world",
      "Overclocked",
      "Neural overlord",
      "God complex",
      "The singularity",
    ],
    skills: ["More RAM", "Neural shield", "God complex", "Delete humanity"],
  },
} as const;
export const THRESHOLDS = [0, 25000, 75000, 150000, 250000];
export function factionStats(snapshot: BattleSnapshot, faction: Faction) {
  const tokens = snapshot.tokens.filter((t) => t.faction === faction);
  const pool = tokens.reduce((sum, t) => sum + t.contribution, 0);
  const total = snapshot.tokens.reduce((sum, t) => sum + t.contribution, 0);
  const stage = THRESHOLDS.filter((n) => pool >= n).length - 1;
  const next = THRESHOLDS[stage + 1];
  return {
    pool,
    power: Math.floor(pool * 0.72),
    control: total ? (pool / total) * 100 : 50,
    count: tokens.length,
    stage,
    next,
    progress: next
      ? ((pool - THRESHOLDS[stage]) / (next - THRESHOLDS[stage])) * 100
      : 100,
  };
}
export const demoResolver: BattleResolver = {
  resolve(snapshot, now) {
    const fly = factionStats(snapshot, "fly").pool;
    const astra = factionStats(snapshot, "astra").pool;
    return {
      winner: fly === astra ? "draw" : fly > astra ? "fly" : "astra",
      reason:
        "Demo rule: the larger creator-fee pool wins. A tie is a draw. No prizes or payouts.",
      resolvedAt: now,
    };
  },
};
export function advancePhase(
  state: BattleSnapshot,
  now: number,
  resolver: BattleResolver = demoResolver,
): BattleSnapshot {
  if (state.phase === "finished") return state;
  if (state.fightStartedAt !== null && now >= state.fightStartedAt + 9000)
    return {
      ...state,
      phase: "finished",
      result: resolver.resolve(state, now),
    };
  if (now >= state.endsAt && state.fightStartedAt === null)
    return { ...state, phase: "fighting", fightStartedAt: now };
  if (state.endsAt - now <= 10000 && state.phase === "preparing")
    return { ...state, phase: "warning" };
  return state;
}
export function validateLaunch(input: LaunchInput): string | null {
  if (!/^[a-zA-Z0-9 ]{1,32}$/.test(input.name.trim()))
    return "Name needs 1–32 letters, numbers, or spaces.";
  if (!/^[A-Z0-9]{1,10}$/.test(input.ticker))
    return "Ticker needs 1–10 letters or numbers.";
  if (!input.description.trim() || input.description.length > 256)
    return "Add a description of up to 256 characters.";
  if (!["fly", "astra"].includes(input.faction)) return "Choose your fighter.";
  if (
    !input.image.startsWith("data:image/") &&
    !input.image.startsWith("/art/")
  )
    return "Add a token image.";
  if (input.website) {
    try {
      if (new URL(input.website).protocol !== "https:")
        return "Website must start with https://.";
    } catch {
      return "Enter a valid https:// website.";
    }
  }
  if (input.x && !/^@?[a-zA-Z0-9_]{1,15}$/.test(input.x))
    return "Enter a valid X handle, up to 15 characters.";
  return null;
}
export const money = (n: number, compact = false) =>
  compact
    ? "$" +
      Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n)
    : "$" + Math.round(n).toLocaleString("en-US");
export function age(at: number, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((now - at) / 1000));
  return seconds < 60
    ? `${seconds}s ago`
    : seconds < 3600
      ? `${Math.floor(seconds / 60)}m ago`
      : seconds < 86400
        ? `${Math.floor(seconds / 3600)}h ago`
        : `${Math.floor(seconds / 86400)}d ago`;
}
