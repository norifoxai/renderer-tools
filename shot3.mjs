import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const out = process.argv[2] || '/root/nori-frame3.png';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
page.on('console', m => { const t = m.text(); if (!t.includes('boneNames')) console.log('[page]', t.slice(0,150)); });
browser.on('disconnected', () => { console.error('BROWSER DIED'); process.exit(2); });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && (window.__glbDebug.error || window.__glbDebug.modelLoaded || window.__glbDebug.hairFlexDeg), null, { timeout: 120000 });
const dbg = await page.evaluate(() => { const d = window.__glbDebug; return { meshCount: d.meshCount, frame: d.frame, missingMorphs: d.missingMorphs }; });
console.log('state:', JSON.stringify(dbg));
if (!dbg.frame || dbg.frame < 3) { console.error('FROZEN, refusing shot'); process.exit(3); }
await page.screenshot({ path: out });
console.log('SHOT WRITTEN:', out);
await browser.close();
process.exit(0);
