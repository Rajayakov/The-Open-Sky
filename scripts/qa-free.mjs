// QA страниц сбора email: форма и выдача, RU и EN. npm run build && node scripts/qa-free.mjs
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
import { execFile } from 'node:child_process'; import { promisify } from 'node:util';
import { chromium } from '@playwright/test';
const run = promisify(execFile);
const ROOT = path.resolve('dist'), PORT = 4402;
const PAGES = [['RU форма', '/free/'], ['EN форма', '/en/free/'], ['RU выдача', '/free/ok/?t=x'], ['EN выдача', '/en/free/ok/?t=x']];
const MT = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = http.createServer((q, r) => {
  const p = decodeURIComponent(q.url.split('?')[0]);
  if (p.startsWith('/api/')) { r.writeHead(200, { 'Content-Type': 'application/json' }); return r.end(JSON.stringify({ ok: true, title: 'Free guide', url: 'https://example.com/guide.pdf' })); }
  let f = path.join(ROOT, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('nf'); }
  const ext = path.extname(f); let b = fs.readFileSync(f); const h = { 'Content-Type': MT[ext] || 'application/octet-stream' };
  if (['.html', '.svg', '.js', '.css'].includes(ext) && /br/.test(q.headers['accept-encoding'] || '')) { b = zlib.brotliCompressSync(b); h['Content-Encoding'] = 'br'; }
  h['Content-Length'] = b.length; r.writeHead(200, h); r.end(b);
}).listen(PORT);
const exe = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const out = [], bad = [], errs = [], small = [];
for (const [name, u] of PAGES) {
  const base = `http://localhost:${PORT}${u}`;
  for (let w = 300; w <= 1920; w += w < 1000 ? 20 : 80) {
    const pg = await browser.newPage({ viewport: { width: w, height: 900 } });
    await pg.goto(base, { waitUntil: 'load' }); await pg.waitForTimeout(400);
    const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) bad.push(`${name} ${w}px (${sw})`);
    await pg.close();
  }
  const pg = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  pg.on('response', r => { if (r.status() >= 400 && !r.url().includes('/_vercel/')) errs.push(`${name} ${r.status()} ${r.url()}`); });
  pg.on('pageerror', e => errs.push(`${name} js: ${e.message}`));
  await pg.goto(base, { waitUntil: 'load' }); await pg.waitForTimeout(800);
  small.push(...await pg.evaluate((n) => [...document.querySelectorAll('a,button,input,select,textarea')].filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && (r.height < 40 || (e.tagName !== 'A' && r.width < 40)) && e.type !== 'checkbox' && e.type !== 'hidden'; }).map(e => `${n}: ${e.tagName} "${(e.innerText || e.name || '').trim().slice(0, 20)}" ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`), name));
  await pg.close();
}
out.push(`оверфлоу 300–1920: ${bad.length ? 'ЕСТЬ ' + bad.join(', ') : 'нет'}`);
out.push(`HTTP/JS-ошибки: ${errs.length ? errs.join('; ') : 'нет'}`);
out.push(`мелкие тап-цели (<40px) на 390px: ${small.length ? small.join('; ') : 'нет'}`);
await browser.close();
for (const [name, u] of PAGES) for (const preset of ['mobile', 'desktop']) {
  const tmp = path.join(fs.mkdtempSync('/tmp/lh-'), 'r.json');
  const args = ['--yes', 'lighthouse', `http://localhost:${PORT}${u}`, '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new --no-sandbox', '--output=json', `--output-path=${tmp}`, '--quiet'];
  if (preset === 'desktop') args.push('--preset=desktop');
  try {
    await run('npx', args, { env: { ...process.env, CHROME_PATH: exe }, maxBuffer: 1 << 26 });
    const d = JSON.parse(fs.readFileSync(tmp, 'utf8')); const a = d.audits;
    const c = Object.fromEntries(Object.entries(d.categories).map(([k, v]) => [k.slice(0, 4), Math.round(v.score * 100)]));
    const v = k => a[k].displayValue.replace(/ /g, ' ');
    out.push(`LH ${name} ${preset}: perf ${c.perf} a11y ${c.acce} bp ${c.best} seo ${c.seo}; FCP ${v('first-contentful-paint')}, LCP ${v('largest-contentful-paint')}, TBT ${v('total-blocking-time')}, CLS ${v('cumulative-layout-shift')}, вес ${v('total-byte-weight').replace('Total size was ', '')}`);
    for (const k of ['color-contrast', 'meta-viewport', 'tap-targets', 'image-alt', 'label']) if (a[k] && a[k].score === 0) out.push(`  ! ${name} ${preset}: провален ${k}`);
  } catch (e) { out.push(`LH ${name} ${preset}: не запустился (${String(e.message).split('\n')[0]})`); }
}
server.close(); console.log(out.join('\n'));
