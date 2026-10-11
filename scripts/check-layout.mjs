// Screenshots at 1440x900 and 390x844 and checks there is no horizontal overflow.
// Usage: npm run build && npm run start   (in one terminal)
//        npx playwright install chromium   (once)
//        npm run check                      (in another terminal)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.env.URL ?? "http://localhost:3000";
mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch();
let failed = false;

for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `screenshots/${name}-hero.png` });
  await page.screenshot({ path: `screenshots/${name}-full.png`, fullPage: true });
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  const ok = sw === iw;
  console.log(`${name}: scrollWidth ${sw} / innerWidth ${iw} -> ${ok ? "OK" : "HORIZONTAL OVERFLOW"}`);
  if (errors.length) console.log(`${name}: console errors:\n  ${errors.join("\n  ")}`);
  if (!ok || errors.length) failed = true;
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
