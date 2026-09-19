import { describe, expect, it } from "vitest";
import {
  advancePhase,
  demoResolver,
  factionStats,
  validateLaunch,
} from "../../src/domain/battle";
import { createSeed } from "../../src/data/seed";
import type { LaunchInput } from "../../src/domain/types";
describe("battle accounting and progression", () => {
  it("attributes every fee to exactly one pool, with complementary control", () => {
    const s = createSeed(1000);
    const f = factionStats(s, "fly");
    const a = factionStats(s, "astra");
    expect(f.pool).toBe(128420);
    expect(a.pool).toBe(104780);
    expect(f.control + a.control).toBe(100);
    expect(f.count + a.count).toBe(s.tokens.length);
    expect(f.power).toBe(Math.floor(f.pool * 0.72));
  });
  it("unlocks the next stage at the exact threshold and caps final progression", () => {
    const s = createSeed(1000);
    s.tokens = s.tokens.filter((t) => t.faction === "fly").slice(0, 1);
    s.tokens[0].contribution = 149999;
    expect(factionStats(s, "fly").stage).toBe(2);
    s.tokens[0].contribution = 150000;
    expect(factionStats(s, "fly").stage).toBe(3);
    expect(factionStats(s, "fly").progress).toBe(0);
    s.tokens[0].contribution = 500000;
    expect(factionStats(s, "fly")).toMatchObject({
      stage: 4,
      next: undefined,
      progress: 100,
    });
  });
  it("handles empty pools and exact ties without assigning a winner", () => {
    const s = createSeed(1000);
    s.tokens = [];
    expect(factionStats(s, "fly").control).toBe(50);
    expect(demoResolver.resolve(s, 2000).winner).toBe("draw");
  });
  it("moves through warning, battle and resolved states without mutating the input", () => {
    const s = createSeed(1000);
    s.endsAt = 20000;
    expect(advancePhase(s, 9999)).toBe(s);
    const warning = advancePhase(s, 10000);
    expect(warning.phase).toBe("warning");
    const fighting = advancePhase(warning, 20000);
    expect(fighting.phase).toBe("fighting");
    expect(fighting.fightStartedAt).toBe(20000);
    expect(advancePhase(fighting, 28999)).toBe(fighting);
    const result = advancePhase(fighting, 29000);
    expect(result.phase).toBe("finished");
    expect(result.result?.winner).toBe("fly");
    expect(advancePhase(result, 90000)).toBe(result);
    expect(s.phase).toBe("preparing");
  });
  it("accepts a different outcome resolver without changing battle state presentation", () => {
    const s = createSeed(1000);
    s.fightStartedAt = 5000;
    s.phase = "fighting";
    const r = advancePhase(s, 20000, {
      resolve: () => ({
        winner: "astra",
        reason: "Another resolver",
        resolvedAt: 20000,
      }),
    });
    expect(r.result?.winner).toBe("astra");
  });
});
describe("launch input boundaries", () => {
  const valid: LaunchInput = {
    name: "A Valid Bug",
    ticker: "BUG",
    description: "An excellent problem.",
    faction: "fly",
    image: "/art/fly.webp",
    website: "https://example.com",
    x: "@test",
  };
  it("accepts a complete valid recruit", () =>
    expect(validateLaunch(valid)).toBeNull());
  it.each([
    { name: "" },
    { ticker: "BAD$" },
    { description: "a".repeat(257) },
    { website: "javascript:alert(1)" },
    { website: "not-a-url" },
    { x: "@bad handle" },
    { image: "https://untrusted.example/image.svg" },
  ])("rejects invalid identity or links %j", (change) =>
    expect(validateLaunch({ ...valid, ...change })).not.toBeNull(),
  );
});
