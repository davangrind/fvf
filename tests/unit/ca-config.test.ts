import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.doUnmock("../../src/config/token.json");
  vi.unstubAllEnvs();
  vi.resetModules();
});

it("uses the published mint even if Vercel retains an older environment value", async () => {
  vi.resetModules();
  const mint = "So11111111111111111111111111111111111111112";
  vi.doMock("../../src/config/token.json", () => ({ default: { mint } }));
  vi.stubEnv("VITE_FVF_CA", "stale-value");
  const config = await import("../../src/domain/solana");
  expect(config.FVF_CA).toBe(mint);
  expect(config.FVF_SWAP_URL).toBe(`https://pump.fun/coin/${mint}`);
});

it("retains the environment fallback until a mint is published", async () => {
  vi.resetModules();
  const mint = "So11111111111111111111111111111111111111112";
  vi.doMock("../../src/config/token.json", () => ({ default: { mint: "" } }));
  vi.stubEnv("VITE_FVF_CA", mint);
  expect((await import("../../src/domain/solana")).FVF_CA).toBe(mint);
});
