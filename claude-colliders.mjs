import { chromium } from "playwright-core";
const exe = "/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const browser = await chromium.launch({ executablePath: exe, args: ["--use-gl=swiftshader","--enable-unsafe-swiftshader","--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto("http://127.0.0.1:8777/glb.html?model=rindo.glb");            // HER page, unmodified
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 200000 });
const st = await page.evaluate(() => window.__colliders({}));
const slim = Object.fromEntries(Object.entries(st).filter(([k, v]) => typeof v !== "object" || v === null));
console.log("resolver status:", JSON.stringify(slim));
console.log("object keys:", Object.keys(st).filter(k => typeof st[k] === "object" && st[k]).join(", "));
await page.evaluate(() => window.__colliders({ on: false }));
const f0 = await page.evaluate(() => window.__glbDebug.frame);
await page.waitForFunction((f) => window.__glbDebug.frame > f + 6, f0, { timeout: 120000 });
await page.screenshot({ path: "/root/claude-colliders-off.png" });
console.log("shot taken at frame", await page.evaluate(() => window.__glbDebug.frame), "with the resolver off");
await browser.close(); process.exit(0);
