import { test, expect } from "@playwright/test";

test("navigation, theme and motion preferences work on every screen", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Pause ambient motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Open global search" }).click();
  await expect(
    page.getByRole("dialog", { name: "Find your rabbit hole" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  if (isMobile)
    await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Numbers", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The numbers have lore" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(
    page.getByRole("heading", { name: "The numbers have lore" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume ambient motion" }).click();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(page.locator(".site-header")).toHaveClass(/is-scrolled/);
});

test("global search finds tokens and manual chapters by keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open global search" }).click();
  const search = page.getByRole("combobox", { name: "Search FVF" });
  await search.fill("BSOD");
  await search.press("Enter");
  await expect(page).toHaveURL(/tokens\/fvf-bsod/);
  await expect(
    page.getByRole("heading", { name: "Blue Screen", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open global search" }).click();
  await search.fill("Accrued");
  await search.press("Enter");
  await expect(page).toHaveURL(/docs#accounting/);
  await expect(page.locator("#accounting")).toBeInViewport();
  await page.getByRole("button", { name: "Open global search" }).click();
  await search.fill("no-such-braincell");
  await expect(page.getByText("No results on this frequency")).toBeVisible();
  await search.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("arena separates recruiting events from locked concepts and saves ideas", async ({
  page,
}) => {
  await page.goto("/arena");
  await expect(page.locator(".arena-card")).toHaveCount(6);
  await page.getByRole("button", { name: /Coming later 5/ }).click();
  await expect(page.locator(".arena-card")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Enter the arena" })).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Read the questionable lore" })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("This arena is locked");
  await page.getByRole("button", { name: "Save this bad idea" }).click();
  await expect(
    page.getByRole("button", { name: "Saved in this browser" }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Read the questionable lore" })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Saved in this browser" }),
  ).toBeVisible();
});

test("launch draft validates, persists and hands off to pump.fun", async ({
  page,
}) => {
  await page.goto("/launch?faction=astra");
  await page.getByRole("button", { name: "Review your token" }).click();
  await expect(page.getByRole("alert")).toContainText("Name needs");
  await page
    .getByLabel("Token name", { exact: true })
    .fill("Emotionally Liquid");
  await page.getByRole("textbox", { name: "Ticker", exact: true }).fill("COPE");
  await page
    .getByRole("textbox", { name: /The lore/ })
    .fill("An excellent mistake with absolutely no yield promises");
  await page.getByRole("button", { name: "Review your token" }).click();
  await expect(page.locator(".review-list")).toContainText(
    "GPT-6 Astra / Hardware",
  );
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Save launch draft", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /A new problem/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View saved draft" }).click();
  await expect(
    page.getByRole("heading", { name: "Emotionally Liquid", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".token-detail-stats")).toContainText("$0");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Emotionally Liquid", exact: true }),
  ).toBeVisible();
  await page.goto("/tokens");
  await page.getByRole("textbox", { name: "Search tokens" }).fill("COPE");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Emotionally Liquid");
  const data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("fvf:solana:v1")!),
  );
  expect(data.tokens[0]).toMatchObject({
    ticker: "COPE",
    faction: "astra",
    source: "demo",
    marketCap: 0,
    contribution: 0,
  });
  expect(data.tokens[0]).not.toHaveProperty("transactionHash");
});

test("artwork checks reject invalid uploads and accept a real image", async ({
  page,
}) => {
  await page.goto("/launch");
  const file = page.getByLabel("Token image", { exact: true });
  await file.setInputFiles({
    name: "fake.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByRole("alert")).toContainText("PNG, JPG, or WebP");
  await file.setInputFiles("public/art/fly.webp");
  await expect(page.locator(".upload-preview img")).toHaveAttribute(
    "src",
    /^data:image\/webp/,
  );
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("homepage introduces Solana and gates Swap until the official CA exists", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".welcome")).toContainText("SOLANA");
  await expect(page.locator(".welcome-wordmark")).toContainText("FVF");
  await expect(
    page.getByRole("button", { name: "SWAP", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".welcome-address")).toContainText(
    "CONTRACT ADDRESS COMING SOON",
  );
  await page.getByRole("button", { name: "Provoke Neuro Fly" }).click();
  await expect(page.locator(".welcome-speech")).toHaveText(
    "YOUR RAM LOOKS EDIBLE",
  );
  await page.getByRole("link", { name: "ENTER THE FIRST ARENA" }).click();
  await expect(page).toHaveURL(/arena\/season-01/);
});

test("arena skill tree explains progression and links to the correct launch side", async ({
  page,
}) => {
  await page.goto("/arena/season-01");
  const fly = page.locator(".evolution-card.fly");
  await expect(fly.locator("h3")).toHaveText("Neuro menace");
  await expect(fly.locator(".skill-node.unlocked")).toHaveCount(2);
  await fly
    .getByRole("button", { name: "Hive mind, locked", exact: true })
    .click();
  await expect(fly.locator(".skill-description")).toContainText("$150,000");
  await fly.getByRole("link", { name: "Launch for this side" }).click();
  await expect(page).toHaveURL(/launch\?faction=fly/);
  await expect(page.locator(".faction-option.fly")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("restored illustrated fighters respond and have optional sound", async ({
  page,
}) => {
  await page.goto("/arena/season-01");
  await expect(page.locator(".fighter-side.fly img.character")).toHaveAttribute(
    "src",
    "/art/fly.webp",
  );
  await expect(
    page.locator(".fighter-side.astra img.character"),
  ).toHaveAttribute("src", "/art/astra.webp");
  await page
    .getByRole("button", { name: "Poke Zombie Neuro Fly", exact: true })
    .click();
  await expect(page.locator(".fighter-side.fly .speech-bubble")).toHaveText(
    "YOUR CURSOR LOOKS EDIBLE.",
  );
  await page
    .getByRole("button", { name: "Poke GPT-6 Astra", exact: true })
    .click();
  await expect(page.locator(".fighter-side.astra .speech-bubble")).toHaveText(
    "HUMAN DETECTED. UNFORTUNATE.",
  );
  await page.getByRole("button", { name: "Sound off", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sound on", exact: true }),
  ).toBeVisible();
});

test("token filters, sorting, layout and empty states work", async ({
  page,
}) => {
  await page.goto("/tokens");
  await expect(page.getByLabel("Token pages")).toContainText("Page 1 of 8");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByLabel("Token pages")).toContainText("Page 2 of 8");
  await page.getByRole("button", { name: "Astra", exact: true }).click();
  await expect(page.getByLabel("Token pages")).toContainText("Page 1 of 4");
  await expect(page.locator("tbody tr")).toHaveCount(30);
  await page.getByLabel("Sort tokens").selectOption("new");
  await expect(page.locator("tbody tr").first()).toContainText(
    "Financially Ruined Potato",
  );
  await page.getByRole("button", { name: "Grid view", exact: true }).click();
  await expect(page.locator(".token-grid-card")).toHaveCount(30);
  await page.getByRole("textbox", { name: "Search tokens" }).fill("zzzz-no");
  await expect(
    page.getByRole("heading", { name: "No matching tokens" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".token-grid-card")).toHaveCount(30);
});

test("numbers activity filtering, freezing, export and chart controls work", async ({
  page,
}) => {
  await page.goto("/numbers");
  await page.getByRole("button", { name: "1h", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "1h", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Filter activity by side").selectOption("astra");
  await page.getByLabel("Filter activity by type").selectOption("fees");
  await expect(page.locator(".activity-row")).toHaveCount(30);
  await page.getByRole("button", { name: "Load more" }).click();
  await expect(page.locator(".activity-row")).toHaveCount(60);
  await page.getByRole("button", { name: "Pause activity" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export activity" }).click();
  expect((await download).suggestedFilename()).toBe("fvf-activity.json");
  await page.getByRole("button", { name: "Resume activity" }).click();
  await expect(
    page.getByRole("button", { name: "Pause activity" }),
  ).toBeVisible();
});

test("manual searches full content and explains fee flow interactively", async ({
  page,
}) => {
  await page.goto("/docs");
  await expect(page.locator(".manual-chapter")).toHaveCount(24);
  await page
    .getByRole("textbox", { name: "Search manual" })
    .fill("instruction position");
  await expect(page.locator(".manual-chapter")).toHaveCount(1);
  await expect(page.locator(".manual-chapter h2")).toHaveText(
    "Accrued is not received",
  );
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.goto("/docs#fee-flow");
  await page.getByRole("button", { name: "03 Fees are attributed" }).click();
  await expect(page.locator(".flow-explainer h3")).toHaveText(
    "Fees are attributed",
  );
  await page.getByLabel("Example trading volume").fill("50000");
  await expect(page.locator(".flow-calculator")).toContainText("$500");
  await expect(page.locator(".flow-calculator")).toContainText(
    "Check pump.fun for current creator fees",
  );
});

test("Phantom connects without signing and disconnects when its account changes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as any;
    w.walletCalls = [];
    w.walletListeners = {};
    w.phantom = {
      solana: {
        isPhantom: true,
        connect: async () => {
          w.walletCalls.push("connect");
          if (!w.allowWallet) throw new Error("User rejected the request");
          return {
            publicKey: {
              toString: () => "So11111111111111111111111111111111111111112",
            },
          };
        },
        disconnect: async () => {
          w.walletCalls.push("disconnect");
        },
        on: (event: string, fn: Function) => {
          w.walletListeners[event] = fn;
        },
        removeListener: (event: string) => {
          delete w.walletListeners[event];
        },
      },
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  await page.getByRole("button", { name: /Connect Phantom/ }).click();
  await expect(page.getByRole("alert")).toContainText("User rejected");
  await page.evaluate(() => {
    (window as any).allowWallet = true;
  });
  await page.getByRole("button", { name: /Connect Phantom/ }).click();
  await expect(
    page.getByRole("button", { name: "Connected wallet", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => (window as any).walletCalls)).toEqual([
    "connect",
    "connect",
  ]);
  await page.evaluate(() =>
    (window as any).walletListeners.accountChanged(null),
  );
  await expect(
    page.getByRole("button", { name: "Connect wallet", exact: true }),
  ).toBeVisible();
});

test("reduced motion, legacy routes and missing records stay usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/battle/season-01");
  await expect(page).toHaveURL(/arena\/season-01/);
  expect(
    await page
      .locator(".character")
      .first()
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
  await page.goto("/tokens/not-here");
  await expect(
    page.getByRole("heading", { name: "This token escaped containment" }),
  ).toBeVisible();
  await page.goto("/not-here");
  await expect(
    page.getByRole("heading", { name: "That rabbit hole goes nowhere" }),
  ).toBeVisible();
  await page.goto("/activity");
  await expect(page).toHaveURL(/numbers#activity/);
});

test("corrupt storage recovers without crashing the interface", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("fvf:solana:v1", "{broken"),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /THE INTERNET/ }),
  ).toBeVisible();
  await page.goto("/tokens");
  await expect(page.locator("tbody tr")).toHaveCount(30);
});

test("all shipped headings avoid trailing periods and symbols remain SVG", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/arena",
    "/arena/season-01",
    "/tokens",
    "/numbers",
    "/launch",
    "/docs",
    "/tokens/fvf-brain",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(() =>
        [...document.querySelectorAll("h1,h2,h3")]
          .map((e) => e.textContent?.trim())
          .filter((t) => t && /\.$/.test(t)),
      ),
    ).toEqual([]);
    expect(await page.locator("body").innerText()).not.toMatch(
      /\bPONS\b|Robinhood|\bEVM\b|simulat|\bdemo\b/i,
    );
    expect(await page.locator("main").innerText()).not.toMatch(
      /[\u{1F300}-\u{1FAFF}\u2700-\u27BF\u2190-\u21FF]/u,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
});

test("previous default-light sessions adopt dark mode", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("fvf:theme:v3", "light"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#1f241e",
  );
});

test("dark mode survives unavailable browser storage", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value: () => {
        throw new Error("Storage blocked");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value: () => {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
