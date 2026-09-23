import { chromium } from 'playwright-core';
import { execSync } from 'child_process';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const names = process.argv[2] ? JSON.parse(process.argv[2]) : null;
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 480, height: 540 } });
page.on('console', () => {});
browser.on('disconnected', () => { console.error('BROWSER DIED'); });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 10, null, { timeout: 300000 });
const all = await page.evaluate(() => window.__listClothing());
const keys = names || Object.keys(all);
const dir = '/root/wardrobe';
execSync(`mkdir -p ${dir}`);
for (const name of keys) {
  await page.evaluate((n) => {
    for (const [k, v] of Object.entries(window.__listClothing())) {
      window.__setClothing(k, k === n);
    }
  }, name);
  const before = await page.evaluate(() => window.__glbDebug.frame);
  await page.waitForFunction((b) => window.__glbDebug.frame > b + 5, before, { timeout: 30000 });
  const out = `${dir}/piece_${name.replace(/[^a-zA-Z0-9]+/g, '_')}.png`;
  await page.screenshot({ path: out });
  console.log('SHOT:', name, '->', out);
}
await browser.close();
console.log('SHEET DONE');
process.exit(0);
