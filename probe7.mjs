import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
// capture ALL console messages (log_ writes to __glbDebug.note but load-time logs may be overwritten; grab note right after load)
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 2, null, { timeout: 120000 });
// poll note rapidly to catch the last load-time log before frame loop overwrites? note is only written at load. Read now:
const d1 = await page.evaluate(() => window.__glbDebug.note);
await page.waitForTimeout(1500);
const d2 = await page.evaluate(() => ({ note: window.__glbDebug.note, frame: window.__glbDebug.frame }));
console.log('note@2frames:', d1);
console.log('note@later:', JSON.stringify(d2));
await browser.close();
process.exit(0);
