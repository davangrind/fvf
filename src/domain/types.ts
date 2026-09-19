export type Faction = "fly" | "astra";
export type BattlePhase = "preparing" | "warning" | "fighting" | "finished";
export interface Token {
  id: string;
  name: string;
  ticker: string;
  description: string;
  faction: Faction;
  image: string;
  emoji: string;
  marketCap: number;
  contribution: number;
  change: number;
  createdAt: number;
  website?: string;
  x?: string;
  source: "demo";
}
export interface BattleEvent {
  id: string;
  faction: Faction;
  kind: "fees" | "launch" | "evolution" | "lead" | "decision" | "battle";
  text: string;
  at: number;
  tokenId?: string;
  source: "demo";
}
export interface PowerPoint {
  at: number;
  fly: number;
  astra: number;
}
export interface BattleResult {
  winner: Faction | "draw";
  reason: string;
  resolvedAt: number;
}
export interface BattleSnapshot {
  version: 1;
  source: "demo";
  tokens: Token[];
  events: BattleEvent[];
  history: PowerPoint[];
  endsAt: number;
  fightStartedAt: number | null;
  phase: BattlePhase;
  result: BattleResult | null;
  sequence: number;
}
export interface LaunchInput {
  name: string;
  ticker: string;
  description: string;
  image: string;
  faction: Faction;
  website?: string;
  x?: string;
}
export type LaunchResult =
  | { source: "demo"; token: Token; receiptId: string }
  | {
      source: "chain";
      tokenAddress: `0x${string}`;
      transactionHash: `0x${string}`;
      chainId: number;
    };
export interface LaunchAdapter {
  readonly source: "demo" | "chain";
  launch(input: LaunchInput): Promise<LaunchResult>;
}
export interface BattleDataAdapter {
  getSnapshot(): BattleSnapshot;
  subscribe(listener: () => void): () => void;
}
export interface BattleResolver {
  resolve(snapshot: BattleSnapshot, now: number): BattleResult;
}
export interface SettlementAdapter {
  readonly enabled: boolean;
  describe(): string;
}
