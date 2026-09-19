import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("research/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [name, url] of [
  ["usepaid", "https://usepaid.app/"],
  ["pepons", "https://pepons.family/"],
  ["hotdog", "https://www.hotdogonrh.com/"],
  ["pons-create", "https://pons.family/launchpad/create"],
  ["usepaid-launch", "https://usepaid.app/launch"],
]) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: true,
  });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3500);
    await page.screenshot({
      path: `research/screenshots/${name}-desktop.png`,
      fullPage: true,
      timeout: 15000,
    });
    const info = await page.evaluate(() => ({
      title: document.title,
      text: document.body.innerText,
      links: [...document.querySelectorAll("a")].map((a) => ({
        text: a.innerText,
        href: a.href,
      })),
    }));
    await writeFile(`research/${name}.json`, JSON.stringify(info, null, 2));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `research/screenshots/${name}-mobile.png`,
      fullPage: true,
    });
    console.log(name, JSON.stringify(info).slice(0, 18000));
  } catch (error) {
    console.log(name, String(error));
  }
  await page.close();
}
await browser.close();
