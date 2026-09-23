import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
page.on('console', m => { const t = m.text(); if (!t.includes('boneNames') && !t.includes('skinning') && !t.includes('GL Driver')) console.log('[page]', t.slice(0,150)); });
browser.on('disconnected', () => { console.error('BROWSER DIED'); process.exit(2); });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
try {
  await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 10, null, { timeout: 300000 });
} catch (e) {
  const f = await page.evaluate(() => window.__glbDebug ? window.__glbDebug.frame : 'no debug').catch(() => 'gone');
  console.log('TIMEOUT, frame was:', f);
  process.exit(3);
}
const list = await page.evaluate(() => window.__listClothing ? window.__listClothing() : 'no __listClothing');
console.log('CLOTHING:', JSON.stringify(list, null, 1));
await browser.close();
process.exit(0);
