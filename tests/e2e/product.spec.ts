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
  await expect(page).toHaveURL(/tokens\/demo-bsod/);
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
  await expect(page.getByText("No brain cells found")).toBeVisible();
  await search.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("arena separates recruiting events from locked concepts and saves ideas", async ({
  page,
}) => {
  await page.goto("/arena");
  await expect(page.locator(".arena-card")).toHaveCount(6);
  await page.getByRole("button", { name: /In the microwave 5/ }).click();
  await expect(page.locator(".arena-card")).toHaveCount(5);
  await expect(page.getByRole("link", { name: "Enter the lab" })).toHaveCount(
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

test("local launch validates, reviews, persists and is searchable", async ({
  page,
}) => {
  await page.goto("/launch?faction=astra");
  await page.getByRole("button", { name: "Review the little guy" }).click();
  await expect(page.getByRole("alert")).toContainText("Name needs");
  await page
    .getByLabel("Token name", { exact: true })
    .fill("Emotionally Liquid");
  await page.getByRole("textbox", { name: "Ticker", exact: true }).fill("COPE");
  await page
    .getByRole("textbox", { name: /The lore/ })
    .fill("An excellent mistake with absolutely no yield promises");
  await page.getByRole("button", { name: "Review the little guy" }).click();
  await expect(page.locator(".review-list")).toContainText(
    "GPT-6 Astra / Hardware",
  );
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Choose a pilot to continue" })
    .click();
  await page.getByRole("button", { name: /Use demo pilot/ }).click();
  await page
    .getByRole("button", { name: "Create demo token", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /A new problem/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Meet your token" }).click();
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
    JSON.parse(localStorage.getItem("fvf:demo:v2")!),
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

test("mutation previews are separate from actual pool unlocks", async ({
  page,
}) => {
  await page.goto("/arena/season-01");
  await page.getByLabel("Scrub through the mutations").fill("4");
  await expect(page.locator(".mutation-info h3")).toHaveText(
    "Extinction event",
  );
  await expect(page.locator(".fighter-zone.fly .faction-pill")).toContainText(
    "Preview / stage 5",
  );
  await expect(page.locator(".skill-tree-heading")).toContainText(
    "2 / 4 unlocked",
  );
  await page.getByRole("button", { name: "Lord of the pings $250K" }).click();
  await expect(page.locator(".skill-detail")).toContainText(
    "Locked in actual progression",
  );
  await page.getByRole("button", { name: "Preview ability" }).click();
  await expect(page.locator(".lab-stage")).toHaveClass(/effect-ascend/);
  await page.getByRole("button", { name: "Return to actual stage" }).click();
  await expect(page.locator(".mutation-info h3")).toHaveText("Neuro menace");
  await page.getByRole("button", { name: "Feed Fly", exact: true }).click();
  await page
    .getByRole("button", { name: "Simulate $25,000 in fees", exact: true })
    .click();
  await expect(page.locator(".mutation-info h3")).toHaveText("Hive mind");
  await expect(page.locator(".skill-tree-heading")).toContainText(
    "3 / 4 unlocked",
  );
  await expect(page.locator(".fighter-zone.fly .base-equipment")).toHaveClass(
    /level-3/,
  );
  await page.reload();
  await expect(page.locator(".mutation-info h3")).toHaveText("Hive mind");
});

test("creatures respond and assistants move with accessible keyboard controls", async ({
  page,
}) => {
  await page.goto("/arena/season-01");
  await page
    .getByRole("button", { name: "Poke Neuro Fly", exact: true })
    .click();
  await expect(page.locator(".fighter-zone.fly .speech-bubble")).toHaveText(
    "i ate the terms & conditions",
  );
  await page.getByRole("button", { name: "Poke Astra", exact: true }).click();
  await expect(page.locator(".fighter-zone.astra .speech-bubble")).toHaveText(
    "i have 8 GB of audacity",
  );
  const assistant = page.getByRole("button", { name: /Move lab assistant 1/ });
  const before = await assistant.evaluate((e) => (e as HTMLElement).style.left);
  await assistant.focus();
  await assistant.press("ArrowRight");
  await expect
    .poll(() => assistant.evaluate((e) => (e as HTMLElement).style.left))
    .not.toBe(before);
  await page.getByRole("button", { name: "Reset interns" }).click();
  await expect
    .poll(() => assistant.evaluate((e) => (e as HTMLElement).style.left))
    .toBe(before);
  await page.getByRole("button", { name: "Sound off", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sound on", exact: true }),
  ).toBeVisible();
});

test("memory toy repeats a sequence, records best score and recovers from mistakes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.05;
  });
  await page.clock.install();
  await page.goto("/arena/season-01");
  await page.getByRole("button", { name: "Start check", exact: true }).click();
  await page.clock.fastForward(1200);
  await expect(page.locator(".memory-status")).toHaveText("Your turn / 0 of 1");
  await page.getByRole("button", { name: "Memory pad A", exact: true }).click();
  await page.clock.fastForward(2600);
  await expect(page.locator(".memory-status")).toHaveText("Your turn / 0 of 2");
  await page.getByRole("button", { name: "Memory pad A", exact: true }).click();
  await page.getByRole("button", { name: "Memory pad A", exact: true }).click();
  await expect(page.getByText("Personal best: 2 rounds")).toBeVisible();
  await page.clock.fastForward(3100);
  await page.getByRole("button", { name: "Memory pad B", exact: true }).click();
  await expect(page.locator(".memory-status")).toContainText(
    "The neuron has left",
  );
  await page.reload();
  await expect(page.getByText("Personal best: 2 rounds")).toBeVisible();
});

test("token filters, sorting, layout and empty states work", async ({
  page,
}) => {
  await page.goto("/tokens");
  await page.getByRole("button", { name: "Astra", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(6);
  await page.getByLabel("Sort tokens").selectOption("new");
  await expect(page.locator("tbody tr").first()).toContainText(
    "Ctrl Alt Defeat",
  );
  await page.getByRole("button", { name: "Grid view", exact: true }).click();
  await expect(page.locator(".token-grid-card")).toHaveCount(6);
  await page.getByRole("textbox", { name: "Search tokens" }).fill("zzzz-no");
  await expect(
    page.getByRole("heading", { name: "No matching tokens" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".token-grid-card")).toHaveCount(12);
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
  await expect(page.locator(".activity-row")).toHaveCount(1);
  await page.getByRole("button", { name: "Pause activity" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export demo activity" }).click();
  expect((await download).suggestedFilename()).toBe("fvf-demo-activity.json");
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
  await page.getByRole("textbox", { name: "Search manual" }).fill("reorg");
  await expect(page.locator(".manual-chapter")).toHaveCount(1);
  await expect(page.locator(".manual-chapter h2")).toHaveText(
    "Attribution before celebration",
  );
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.goto("/docs#fee-flow");
  await page.getByRole("button", { name: "03 Fees are attributed" }).click();
  await expect(page.locator(".flow-explainer h3")).toHaveText(
    "Fees are attributed",
  );
  await page.getByLabel("Try an imaginary trading volume").fill("50000");
  await expect(page.locator(".flow-calculator")).toContainText("$500");
  await expect(page.locator(".flow-calculator")).toContainText(
    "not a confirmed pons rate",
  );
});

test("wallet connection only reads accounts and rejection can recover", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).requestedMethods = [];
    window.ethereum = {
      request: async ({ method }: { method: string }) => {
        (window as any).requestedMethods.push(method);
        if (!(window as any).allowWallet)
          throw new Error("User rejected the request");
        return method === "eth_requestAccounts"
          ? ["0x1234567890123456789012345678901234567890"]
          : "0x1237";
      },
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Connect browser wallet", exact: false })
    .click();
  await expect(page.getByRole("alert")).toContainText("User rejected");
  await page.evaluate(() => {
    (window as any).allowWallet = true;
  });
  await page
    .getByRole("button", { name: "Connect browser wallet", exact: false })
    .click();
  await expect(
    page.getByRole("button", { name: "Connected wallet", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => (window as any).requestedMethods)).toEqual([
    "eth_requestAccounts",
    "eth_requestAccounts",
    "eth_chainId",
  ]);
});

test("reduced motion, legacy routes and missing records stay usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/battle/season-01");
  await expect(page).toHaveURL(/arena\/season-01/);
  expect(
    await page
      .locator(".creature-float")
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
    localStorage.setItem("fvf:demo:v2", "{broken"),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Internet nonsense/ }),
  ).toBeVisible();
  await page.goto("/tokens");
  await expect(page.locator("tbody tr")).toHaveCount(12);
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
    "/tokens/demo-brain",
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
