import { test, expect } from "@playwright/test";
test("wallet rejection leaves the pilot disconnected and shows a recoverable error", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.ethereum = {
      request: async () => {
        throw new Error("User rejected the request.");
      },
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  await page.getByRole("button", { name: /Connect browser wallet/ }).click();
  await expect(page.getByRole("alert")).toContainText("User rejected");
  await page.getByRole("button", { name: /Use demo pilot/ }).click();
  await expect(
    page.getByRole("button", { name: "Demo pilot", exact: true }),
  ).toBeVisible();
});
test("mobile navigation and missing token recovery remain usable", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile)
    await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Tokens", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "THE ARSENAL." }),
  ).toBeVisible();
  await page.goto("/tokens/demo-missing");
  await expect(
    page.getByRole("heading", { name: "RECRUIT MISSING IN ACTION." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to the arsenal" }).click();
  await expect(page.locator(".token-row")).toHaveCount(12);
});
test("home explains the fight and faction CTA opens the right recruit flow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "FEES FEED THE FIGHT." }),
  ).toBeVisible();
  await expect(page.getByText("DEMO BROADCAST")).toBeVisible();
  await page.getByRole("link", { name: "Join Astra", exact: true }).click();
  await expect(page).toHaveURL(/launch\?faction=astra/);
  await expect(
    page.getByRole("button", { name: /Join Astra ARTIFICIALLY/ }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});
test("validation, faction selection, review, wallet, launch, details and persistence", async ({
  page,
}) => {
  await page.goto("/launch");
  await page.getByRole("button", { name: "Review your weapon" }).click();
  await expect(page.getByRole("alert")).toContainText("Name needs");
  await page.getByRole("button", { name: /Join Astra ARTIFICIALLY/ }).click();
  await page.getByLabel("Token name", { exact: true }).fill("Test Menace");
  await page.getByLabel("Ticker", { exact: true }).fill("TEST");
  await page.getByLabel(/The lore/).fill("No thoughts. Only regression tests.");
  await page.getByRole("button", { name: "Review your weapon" }).click();
  await expect(page.getByText("GPT-6 Astra", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Local demo · no chain transaction"),
  ).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Connect to launch" }).click();
  await page.getByRole("button", { name: /Use demo pilot/ }).click();
  await page.getByRole("button", { name: "Launch demo token" }).click();
  await expect(
    page.getByRole("heading", { name: "YOUR TOKEN IS NOW A WEAPON." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Meet your recruit" }).click();
  await expect(
    page.getByRole("heading", { name: "Test Menace" }),
  ).toBeVisible();
  await expect(page.getByText("LOCAL DEMO TOKEN")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Test Menace" }),
  ).toBeVisible();
  await page.goto("/tokens");
  await page.getByLabel("Search tokens").fill("Test Menace");
  await expect(page.locator(".token-row")).toHaveCount(1);
  await expect(page.locator(".token-row")).toContainText("$0");
});
test("upload checks format and accepts local art without a network upload", async ({
  page,
}) => {
  await page.goto("/launch");
  await page.getByLabel("Token image", { exact: true }).setInputFiles({
    name: "bad.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByRole("alert")).toContainText("PNG, JPG, or WebP");
  await page
    .getByLabel("Token image", { exact: true })
    .setInputFiles("public/art/fly.webp");
  await expect(page.locator(".upload-preview img")).toHaveAttribute(
    "src",
    /^data:image\/webp;base64,/,
  );
});
test("token search, faction filters, newest ordering and empty states", async ({
  page,
}) => {
  await page.goto("/tokens");
  await page.getByRole("button", { name: "Astra elite" }).click();
  await expect(page.locator(".token-row")).toHaveCount(6);
  await expect(page.locator(".token-contribution")).not.toContainText([
    "THE SWARM",
  ]);
  await page.getByLabel("Search tokens").fill("does not exist");
  await expect(page.getByText("NO PROBLEMS FOUND.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".token-row")).toHaveCount(12);
  await page.getByLabel("Sort tokens").selectOption("newest");
  await expect(page.locator(".token-row").first()).toContainText(
    "Ctrl Alt Defeat",
  );
});
test("progression and full cinematic resolve a deterministic result", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/battle/season-01");
  await page
    .getByRole("button", { name: "Simulate $25K in fees" })
    .first()
    .click();
  await expect(page.locator(".evolution-card.fly")).toContainText("Hive mind");
  await page.getByRole("button", { name: "Fast-forward finale" }).click();
  await expect(
    page.getByRole("heading", { name: "OH, IT'S HAPPENING." }),
  ).toBeVisible();
  await page.clock.runFor(9000);
  await expect(page.locator(".arena")).toHaveClass(/phase-fighting/);
  await expect(page.locator(".combat-effects")).toBeVisible();
  await page.clock.runFor(10000);
  await expect(
    page.getByRole("heading", { name: "THE SWARM WINS." }),
  ).toBeVisible();
  await expect(page.getByText("SIMULATED FINAL / NO PAYOUTS")).toBeVisible();
  await page.getByRole("button", { name: "Restart demo round" }).click();
  await expect(page.locator(".arena")).toHaveClass(/phase-preparing/);
});
test("activity pause preserves the visible feed and export is tagged demo", async ({
  page,
}) => {
  await page.goto("/activity");
  await page.getByRole("button", { name: "Pause feed" }).click();
  await expect(page.getByText(/FEED PAUSED/)).toBeVisible();
  await page.getByLabel("Event type").selectOption("launch");
  await expect(page.locator(".event-row")).toHaveCount(1);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export demo log" }).click();
  expect((await download).suggestedFilename()).toBe("fvf-demo-events.json");
  await page.getByRole("button", { name: "Resume feed" }).click();
  await expect(page.getByText(/DEMO STREAM/)).toBeVisible();
});
test("account-only connection never requests a signature or transaction", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as unknown as { walletCalls: string[] }).walletCalls = [];
    window.ethereum = {
      request: async ({ method }) => {
        (window as unknown as { walletCalls: string[] }).walletCalls.push(
          method,
        );
        if (method === "eth_requestAccounts")
          return ["0x1234567890123456789012345678901234567890"];
        if (method === "eth_chainId") return "0x1237";
        throw new Error("Unexpected signing request");
      },
    };
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  await page.getByRole("button", { name: /Connect browser wallet/ }).click();
  await expect(page.getByRole("button", { name: /0x1234/ })).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as unknown as { walletCalls: string[] }).walletCalls,
    ),
  ).toEqual(["eth_requestAccounts", "eth_chainId"]);
});
test("dialog supports Escape and reduced motion disables ticker and character animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Connect wallet", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page
      .locator(".character")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
test("all routes render without browser errors or horizontal page overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const path of [
    "/",
    "/battle/season-01",
    "/launch",
    "/tokens",
    "/tokens/demo-brain",
    "/activity",
    "/docs",
    "/missing",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
