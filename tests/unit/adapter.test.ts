import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { DemoAdapter } from "../../src/data/demo-adapter";
import { PumpProductionAdapter } from "../../src/data/production-adapter";
import { factionStats } from "../../src/domain/battle";
import type { LaunchInput } from "../../src/domain/types";
const input: LaunchInput = {
  name: "Local recruit",
  ticker: "LOCAL",
  description: "A token with no chain transaction.",
  faction: "astra",
  image: "/art/astra.webp",
};
describe("demo boundary", () => {
  let storage: Map<string, string>;
  beforeEach(() => {
    storage = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => storage.get(k) ?? null,
      setItem: (k: string, v: string) => storage.set(k, v),
    });
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
  it("launches a local record without inventing an address, hash or fees", async () => {
    const adapter = new DemoAdapter();
    const before = factionStats(adapter.getSnapshot(), "astra");
    const promise = adapter.launch(input);
    await vi.advanceTimersByTimeAsync(1000);
    const r = await promise;
    expect(r.source).toBe("demo");
    expect(r).not.toHaveProperty("transactionHash");
    expect(r).not.toHaveProperty("tokenAddress");
    expect(factionStats(adapter.getSnapshot(), "astra").count).toBe(
      before.count + 1,
    );
    expect(factionStats(adapter.getSnapshot(), "astra").pool).toBe(before.pool);
    expect(adapter.getSnapshot().events[0].kind).toBe("launch");
    const restored = new DemoAdapter();
    expect(restored.getSnapshot().tokens[0].name).toBe(input.name);
  });
  it("rejects duplicate in-flight launches", async () => {
    const a = new DemoAdapter();
    const p = a.launch(input);
    await expect(a.launch(input)).rejects.toThrow("already in progress");
    await vi.advanceTimersByTimeAsync(1000);
    await p;
  });
  it("routes a simulated fee to a recruit and emits a threshold unlock", () => {
    const a = new DemoAdapter();
    const before = factionStats(a.getSnapshot(), "fly").pool;
    a.simulate("fly", 25000);
    expect(factionStats(a.getSnapshot(), "fly").pool).toBe(before + 25000);
    expect(a.getSnapshot().events[0].kind).toBe("evolution");
    expect(a.getSnapshot().history.at(-1)?.fly).toBe(before + 25000);
  });
  it("freezes recruitment and fees as the finale begins", async () => {
    const a = new DemoAdapter();
    a.fastForward();
    const before = a.getSnapshot();
    a.simulate("fly", 25000);
    expect(a.getSnapshot()).toBe(before);
    await expect(a.launch(input)).rejects.toThrow("Recruitment is closed");
    a.restart();
    expect(a.getSnapshot().phase).toBe("preparing");
  });
  it("fails closed for production launches", async () => {
    await expect(new PumpProductionAdapter().launch(input)).rejects.toThrow(
      "Production launch is not configured",
    );
  });
  it("preserves older saved tokens while loading the expanded catalog", () => {
    storage.set(
      "fvf:demo:v2",
      JSON.stringify({
        tokens: [
          {
            ...input,
            id: "demo-12345678-1234-1234-1234-123456789abc",
            source: "demo",
            contribution: 123,
            marketCap: 0,
            change: 0,
            emoji: "",
            createdAt: 1,
          },
        ],
      }),
    );
    const snapshot = new DemoAdapter().getSnapshot();
    expect(snapshot.tokens).toHaveLength(241);
    expect(snapshot.tokens[0]).toMatchObject({
      id: "fvf-12345678-1234-1234-1234-123456789abc",
      contribution: 123,
    });
    expect(storage.has("fvf:demo:v2")).toBe(true);
    expect(
      snapshot.events.every(
        (e) => !e.tokenId || snapshot.tokens.some((t) => t.id === e.tokenId),
      ),
    ).toBe(true);
  });
  it("survives corrupt or unavailable browser storage", () => {
    storage.set("fvf:solana:v1", "{broken");
    expect(new DemoAdapter().getSnapshot().tokens.length).toBe(240);
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    const a = new DemoAdapter();
    a.simulate("fly", 1);
    expect(a.persistenceAvailable).toBe(false);
    expect(factionStats(a.getSnapshot(), "fly").pool).toBe(128421);
  });
});
