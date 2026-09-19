import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("https://pepons.family/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const skip = page.getByText("skip", { exact: false });
if (await skip.count()) await skip.first().click();
await page.waitForTimeout(2000);
await page.screenshot({
  path: "research/screenshots/pepons-after-intro-desktop.png",
});
await writeFile(
  "research/pepons-after-intro.txt",
  await page.locator("body").innerText(),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: "research/screenshots/pepons-after-intro-mobile.png",
});
await page.setViewportSize({ width: 1440, height: 1000 });
for (const [name, url] of [
  ["pons-current", "https://www.ponsfamily.com/launchpad/create"],
  ["usepaid-pons", "https://usepaid.app/launch"],
]) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(1800);
    if (name === "usepaid-pons") {
      const pons = page.getByRole("button", { name: "Pons", exact: true });
      if (await pons.count()) await pons.click();
    }
    await page.screenshot({
      path: `research/screenshots/${name}-desktop.png`,
      fullPage: true,
    });
    await writeFile(
      `research/${name}.txt`,
      await page.locator("body").innerText(),
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: `research/screenshots/${name}-mobile.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    console.log(name, (await page.locator("body").innerText()).slice(0, 13000));
  } catch (e) {
    console.log(name, String(e));
  }
}
await browser.close();
