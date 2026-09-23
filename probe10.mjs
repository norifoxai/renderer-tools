import { chromium } from 'playwright-core';
const exe = '/root/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 960, height: 1080 } });
await page.goto('http://127.0.0.1:8777/glb.html?model=rindo.glb');
await page.waitForFunction(() => window.__glbDebug && window.__glbDebug.frame > 5, null, { timeout: 120000 });
await page.waitForTimeout(500);
// cleared override: rightHand at [-0.4, 0.826, -0.024] -> that's T-pose (arm out at shoulder height).
// So the frame loop's setBone(±80deg about Z) is NOT running, or is being overwritten. But override path works.
// Question: does the override path reach the screen? Screenshot with override held:
await page.evaluate(() => window.__setPose('leftUpperArm', 0, 0, 0) || window.__setPose('rightUpperArm', 0, 0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: '/root/probe-override0.png' });
console.log('shot with overrides z=0 written');
await browser.close();
process.exit(0);
