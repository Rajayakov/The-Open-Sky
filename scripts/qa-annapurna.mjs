// QA лендинга Аннапурны: npm run qa  (после npm run build)
// Проверяет: оверфлоу 300–1000 px, битые картинки/404, Lighthouse mobile+desktop (локально, с brotli).
// Печатает короткий итог. Подробности: --verbose
// Если Chromium Playwright не установлен: CHROME_PATH=/путь/к/chrome npm run qa  (или npx playwright install chromium)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);
import { chromium } from '@playwright/test';

const ROOT = path.resolve('dist');
const PORT = 4401;
const URL_PATH = '/mountains/annapurna-2027/';
const verbose = process.argv.includes('--verbose');
const MT = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

if (!fs.existsSync(path.join(ROOT, URL_PATH, 'index.html'))) { console.error('Нет dist. Сначала: npm run build'); process.exit(1); }

const server = http.createServer((q, r) => {
  const p = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(ROOT, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end('nf'); }
  const ext = path.extname(f);
  let b = fs.readFileSync(f);
  const h = { 'Content-Type': MT[ext] || 'application/octet-stream' };
  if (['.html', '.svg', '.js', '.css'].includes(ext) && /br/.test(q.headers['accept-encoding'] || '')) { b = zlib.brotliCompressSync(b); h['Content-Encoding'] = 'br'; }
  h['Content-Length'] = b.length; r.writeHead(200, h); r.end(b);
}).listen(PORT);

const base = `http://localhost:${PORT}${URL_PATH}`;
const out = [];
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// 1. оверфлоу
const bad = [];
for (let w = 300; w <= 1000; w += 20) {
  const pg = await browser.newPage({ viewport: { width: w, height: 900 } });
  await pg.goto(base, { waitUntil: 'load' });
  await pg.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => (i.loading = 'eager')));
  await pg.waitForTimeout(300);
  const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w) bad.push(`${w}px (ширина ${sw})`);
  await pg.close();
}
out.push(`оверфлоу 300–1000: ${bad.length ? 'ЕСТЬ ' + bad.join(', ') : 'нет'}`);

// 2. 404 и битые картинки (локальные /_vercel/* 404 ожидаемы)
const pg = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errs = [];
pg.on('response', r => { if (r.status() >= 400 && !r.url().includes('/_vercel/')) errs.push(`${r.status()} ${r.url()}`); });
await pg.goto(base, { waitUntil: 'load' });
await pg.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => (i.loading = 'eager')));
await pg.waitForTimeout(2000);
const broken = await pg.evaluate(() => [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
out.push(`HTTP-ошибки: ${errs.length ? errs.join('; ') : 'нет'}; битые картинки: ${broken.length ? broken.join('; ') : 'нет'}`);
const exe = process.env.CHROME_PATH || chromium.executablePath();
await browser.close();

// 3. Lighthouse
for (const preset of ['mobile', 'desktop']) {
  const tmp = path.join(fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'lh-')), 'r.json');
  const args = ['--yes', 'lighthouse', base, '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new --no-sandbox', '--output=json', `--output-path=${tmp}`, '--quiet'];
  if (preset === 'desktop') args.push('--preset=desktop');
  try {
    await run('npx', args, { env: { ...process.env, CHROME_PATH: exe }, maxBuffer: 1 << 26 }); // async: иначе блокируется встроенный сервер
    const d = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    const c = Object.fromEntries(Object.entries(d.categories).map(([k, v]) => [k.slice(0, 4), Math.round(v.score * 100)]));
    const a = d.audits;
    const v = k => a[k].displayValue.replace(/ /g, ' ');
    out.push(`Lighthouse ${preset}: perf ${c.perf} a11y ${c.acce} bp ${c['best']} seo ${c.seo}; FCP ${v('first-contentful-paint')}, LCP ${v('largest-contentful-paint')}, TBT ${v('total-blocking-time')}, CLS ${v('cumulative-layout-shift')}, вес ${v('total-byte-weight').replace('Total size was ', '')}`);
  } catch (e) { out.push(`Lighthouse ${preset}: не запустился (${String(e.message).split('\n')[0]})`); }
}

server.close();
console.log(out.join('\n'));
console.log('Локальные 404 на /_vercel/* игнорируются: на Vercel эти скрипты есть.');
process.exit(bad.length || errs.length || broken.length ? 1 : 0);
