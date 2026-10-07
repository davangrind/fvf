import { describe, expect, it } from "vitest";
import { isSolanaAddress, pumpTokenUrl } from "../../src/domain/solana";
import { createSeed } from "../../src/data/seed";

describe("Solana purchase destination", () => {
  it("keeps empty, malformed and EVM addresses disabled", () => {
    for (const value of [
      "",
      "COMING SOON",
      "0x1234567890123456789012345678901234567890",
      "a".repeat(32),
      "z".repeat(44),
      "https://example.com",
      "1".repeat(33),
    ]) {
      expect(isSolanaAddress(value)).toBe(false);
      expect(pumpTokenUrl(value)).toBeNull();
    }
  });
  it("links an exact 32-byte mint to its pump.fun page", () => {
    const mint = "So11111111111111111111111111111111111111112";
    expect(pumpTokenUrl(mint)).toBe(`https://pump.fun/coin/${mint}`);
    expect(isSolanaAddress("1".repeat(32))).toBe(true);
  });
});

describe("expanded catalog integrity", () => {
  it("has unique tokens and traceable, chronological activity", () => {
    const snapshot = createSeed();
    const ids = new Set(snapshot.tokens.map((t) => t.id));
    expect(snapshot.tokens).toHaveLength(240);
    expect(ids.size).toBe(240);
    expect(new Set(snapshot.tokens.map((t) => t.ticker)).size).toBe(240);
    expect(snapshot.events.length).toBeGreaterThanOrEqual(480);
    expect(
      snapshot.events.every(
        (e, i) =>
          (!e.tokenId || ids.has(e.tokenId)) &&
          (i === 0 || e.at <= snapshot.events[i - 1].at),
      ),
    ).toBe(true);
    expect(snapshot.history).toHaveLength(169);
    expect(snapshot.history.at(-1)).toMatchObject({
      fly: 128420,
      astra: 104780,
    });
  });
});
