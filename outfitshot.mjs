// outfitshot.mjs <outfit-name> <out.png> -- dress the model from outfits.json, wait for frames, shoot
import { chromium } from 'playwright-core';
import fs from 'fs';

const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const [name, out] = process.argv.slice(2);
const outfits = JSON.parse(fs.readFileSync('/root/face3d-headless/outfits.json', 'utf8'));
const pieces = outfits[name];
if (!pieces) { console.error('REFUSED: unknown outfit ' + name + ', have: ' + Object.keys(outfits).join(', ')); process.exit(1); }

const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
browser.on('disconnected', () => { console.error('BROWSER DIED'); process.exit(2); });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
try {
  await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
  await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
  const list = await page.evaluate(() => window.__listClothing());
  const known = new Set(Object.keys(list));
  const unknown = pieces.filter(p => !known.has(p));
  if (unknown.length) { console.error('REFUSED: UNKNOWN PIECES: ' + unknown.join(', ')); await browser.close(); process.exit(1); }
  for (const [k, v] of Object.entries(list)) {
    if (v === null) continue;
    await page.evaluate(([nm, vis]) => window.__setClothing(nm, vis), [k, pieces.includes(k)]);
  }
  const before = await page.evaluate(() => window.__glbDebug.frame);
  await page.waitForFunction((b) => window.__glbDebug.frame > b, null, { timeout: 15000 }, before);
  await page.screenshot({ path: out });
  console.log('SHOT WRITTEN:', out, 'outfit=' + name);
} catch (e) {
  console.error('FROZEN OR DEAD: ' + e.message);
  process.exit(1);
} finally {
  try { await browser.close(); } catch {}
}
process.exit(0);
