#!/usr/bin/env node
// Operator: drive the dedicated agent browser over CDP.
// The browser is a real Chrome with its own profile (~/.pumasi/operator-chrome),
// started by launch.sh. A human signs into accounts there ONCE; after that,
// agents perform Console-only tasks that have no API, and screenshot each step.
//
//   node op.js goto <url>
//   node op.js shot [path]          full-page screenshot (default shot.png)
//   node op.js click <text|css=sel> clicks first match (visible text or css=...)
//   node op.js fill <css> <text>
//   node op.js press <key>
//   node op.js text                 dump visible text of the page
//   node op.js links                list clickable elements with their text
//   node op.js url                  current url + title
//   node op.js js <expression>      evaluate in page, print result
const { chromium } = require('playwright-core');

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const ctx = browser.contexts()[0];
  const page = ctx.pages().find(p => !p.url().startsWith('devtools')) || await ctx.newPage();
  const out = (s) => console.log(s);
  try {
    switch (cmd) {
      case 'goto':
        await page.goto(args[0], { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(2500);
        out(`at: ${page.url()}`);
        break;
      case 'shot': {
        const path = args[0] || 'shot.png';
        await page.screenshot({ path, fullPage: false });
        out(`saved: ${path} (${page.url()})`);
        break;
      }
      case 'click': {
        const t = args.join(' ');
        let clicked = false;
        for (const frame of page.frames()) {
          const loc = t.startsWith('css=')
            ? frame.locator(t.slice(4)).first()
            : frame.getByText(t, { exact: false }).first();
          if (await loc.count().catch(() => 0)) {
            await loc.click({ timeout: 15000 });
            clicked = true;
            break;
          }
        }
        if (!clicked) throw new Error(`not found in any frame: ${t}`);
        await page.waitForTimeout(2000);
        out(`clicked: ${t} → ${page.url()}`);
        break;
      }
      case 'fill': {
        let filled = false;
        for (const frame of page.frames()) {
          const loc = frame.locator(args[0]).first();
          if (await loc.count().catch(() => 0)) {
            await loc.fill(args.slice(1).join(' '), { timeout: 15000 });
            filled = true;
            break;
          }
        }
        if (!filled) throw new Error(`not found in any frame: ${args[0]}`);
        out('filled');
        break;
      }
      case 'wheel':
        await page.mouse.move(Number(args[0]), Number(args[1]));
        await page.mouse.wheel(0, Number(args[2] || 400));
        await page.waitForTimeout(1000);
        out('scrolled');
        break;
      case 'clickxy':
        await page.mouse.click(Number(args[0]), Number(args[1]));
        await page.waitForTimeout(2500);
        out(`clicked (${args[0]},${args[1]}) → ${page.url()}`);
        break;
      case 'type':
        await page.keyboard.type(args.join(' '), { delay: 30 });
        out('typed');
        break;
      case 'press':
        await page.keyboard.press(args[0]);
        await page.waitForTimeout(1500);
        out(`pressed ${args[0]}`);
        break;
      case 'text':
        out((await page.locator('body').innerText()).slice(0, 8000));
        break;
      case 'links': {
        const els = await page.locator('a, button, [role=button], [role=tab], [role=menuitem]').all();
        for (const el of els.slice(0, 120)) {
          const t = (await el.innerText().catch(() => '')).trim().replace(/\s+/g, ' ');
          if (t) out(`- ${t.slice(0, 90)}`);
        }
        break;
      }
      case 'url':
        out(`${page.url()}  «${await page.title()}»`);
        break;
      case 'js':
        out(JSON.stringify(await page.evaluate(args.join(' '))));
        break;
      default:
        out('unknown command'); process.exitCode = 2;
    }
  } finally {
    browser.close();
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
