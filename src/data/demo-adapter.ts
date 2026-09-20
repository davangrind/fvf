import { factionStats, validateLaunch, FACTIONS } from "../domain/battle";
import type {
  BattleDataAdapter,
  BattleEvent,
  BattleSnapshot,
  Faction,
  LaunchAdapter,
  LaunchInput,
  LaunchResult,
  SettlementAdapter,
} from "../domain/types";
import { createSeed } from "./seed";
const STORAGE_KEY = "fvf:demo:v2";
export class DemoAdapter implements BattleDataAdapter, LaunchAdapter {
  readonly source = "demo" as const;
  private state: BattleSnapshot;
  private listeners = new Set<() => void>();
  private inFlight = false;
  private timer: ReturnType<typeof setInterval> | undefined;
  persistenceAvailable = true;
  constructor() {
    this.state = createSeed();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed.version === 1 &&
          parsed.source === "demo" &&
          Array.isArray(parsed.tokens) &&
          parsed.tokens.every((t: { contribution: number }) =>
            Number.isFinite(t.contribution),
          ) &&
          Array.isArray(parsed.events) &&
          Array.isArray(parsed.history) &&
          Number.isFinite(parsed.endsAt)
        )
          this.state = parsed;
      }
    } catch {
      this.persistenceAvailable = false;
    }
  }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private commit(state: BattleSnapshot) {
    this.state = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      this.persistenceAvailable = true;
    } catch {
      this.persistenceAvailable = false;
    }
    this.listeners.forEach((l) => l());
  }
  start() {
    if (this.timer) return;
    this.commit({ ...this.state });
    let ticks = 0;
    this.timer = setInterval(() => {
      if (document.hidden) return;
      if (++ticks % 7 === 0 && this.state.phase === "preparing")
        this.simulate();
    }, 1000);
  }
  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }
  private addEvent(
    state: BattleSnapshot,
    event: Omit<BattleEvent, "id" | "at" | "source">,
  ) {
    return [
      {
        ...event,
        id: crypto.randomUUID(),
        at: Date.now(),
        source: "demo" as const,
      },
      ...state.events,
    ].slice(0, 80);
  }
  simulate(faction?: Faction, amount?: number) {
    if (this.state.phase !== "preparing") return;
    const s = this.state;
    const pool = faction
      ? s.tokens.filter((t) => t.faction === faction)
      : s.tokens;
    if (!pool.length) return;
    const token = pool[(s.sequence * 7 + 3) % pool.length];
    const value =
      amount ?? [42, 128, 69, 248, 86, 175, 420, 93][s.sequence % 8];
    const oldStage = factionStats(s, token.faction).stage;
    const oldLead = factionStats(s, "fly").control >= 50;
    let next: BattleSnapshot = {
      ...s,
      sequence: s.sequence + 1,
      tokens: s.tokens.map((t) =>
        t.id === token.id ? { ...t, contribution: t.contribution + value } : t,
      ),
    };
    next.events = this.addEvent(next, {
      faction: token.faction,
      kind: "fees",
      tokenId: token.id,
      text: `$${token.ticker} fed $${value.toLocaleString("en-US")} to ${token.faction === "fly" ? "the swarm" : "Astra"}. ${s.sequence % 2 ? "Zero chill detected." : "Appetite: concerning."}`,
    });
    const stats = factionStats(next, token.faction);
    if (stats.stage > oldStage)
      next.events = this.addEvent(next, {
        faction: token.faction,
        kind: "evolution",
        text: `${FACTIONS[token.faction].stages[stats.stage].toUpperCase()} unlocked. This is probably fine.`,
      });
    if (factionStats(next, "fly").control >= 50 !== oldLead)
      next.events = this.addEvent(next, {
        faction: token.faction,
        kind: "lead",
        text: `${FACTIONS[token.faction].short} took the lead. The other side is coping.`,
      });
    next.history = [
      ...next.history,
      {
        at: Date.now(),
        fly: factionStats(next, "fly").pool,
        astra: factionStats(next, "astra").pool,
      },
    ].slice(-100);
    this.commit(next);
  }
  async launch(input: LaunchInput): Promise<LaunchResult> {
    if (this.inFlight) throw new Error("A launch is already in progress.");
    const error = validateLaunch(input);
    if (error) throw new Error(error);
    if (this.state.phase !== "preparing")
      throw new Error(
        "Recruitment is closed for this round. Restart the demo round in the arena.",
      );
    this.inFlight = true;
    try {
      await new Promise((r) => setTimeout(r, 900));
      if (this.state.phase !== "preparing")
        throw new Error(
          "This round has closed. Your draft is safe; restart the demo round to launch.",
        );
      const token = {
        ...input,
        name: input.name.trim(),
        id: `demo-${crypto.randomUUID()}`,
        emoji: input.faction === "fly" ? "🧪" : "⚡",
        marketCap: 0,
        contribution: 0,
        change: 0,
        createdAt: Date.now(),
        source: "demo" as const,
      };
      const state = { ...this.state, tokens: [token, ...this.state.tokens] };
      state.events = this.addEvent(state, {
        faction: input.faction,
        kind: "launch",
        tokenId: token.id,
        text: `$${token.ticker} joined ${input.faction === "fly" ? "the swarm" : "Astra"}. Your token is now a problem.`,
      });
      this.commit(state);
      return { source: "demo", token, receiptId: `local-${token.id}` };
    } finally {
      this.inFlight = false;
    }
  }
  fastForward() {
    if (this.state.phase !== "preparing") return;
    this.commit({
      ...this.state,
      endsAt: Date.now() + 8000,
      phase: "warning",
      fightStartedAt: null,
      result: null,
    });
  }
  restart() {
    this.commit({
      ...this.state,
      endsAt: Date.now() + 222499000,
      phase: "preparing",
      fightStartedAt: null,
      result: null,
    });
  }
}
export const demoAdapter = new DemoAdapter();
export const settlement: SettlementAdapter = {
  enabled: false,
  describe: () => "This demo has no settlement, betting, rewards, or payouts.",
};
