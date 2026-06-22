import { test, expect, Page } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/retreats', name: 'Retreats' },
  { path: '/mountains', name: 'Mountains' },
  { path: '/programs', name: 'Programs' },
  { path: '/mentorship', name: 'Mentorship' },
  { path: '/music', name: 'Music' },
  { path: '/about', name: 'About' },
  { path: '/connect', name: 'Connect' },
];

async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

for (const { path, name } of PAGES) {
  test(`${name} — загружается без ошибок`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status(), `HTTP статус ${name}`).toBe(200);

    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: `test-results/screenshots/${name.toLowerCase()}.png`,
      fullPage: true,
    });

    expect(errors, `Консольные ошибки на ${name}: ${errors.join(', ')}`).toHaveLength(0);
  });
}

test('навигация — все ссылки рабочие', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const links = await page.locator('nav a, header a').all();
  const hrefs = await Promise.all(links.map(l => l.getAttribute('href')));
  const internalLinks = hrefs.filter(h => h && h.startsWith('/') && !h.startsWith('//'));

  for (const href of internalLinks) {
    const res = await page.goto(href!);
    expect(res?.status(), `Ссылка ${href} сломана`).toBeLessThan(400);
  }
});

test('нет сломанных изображений', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const imgs = await page.locator('img').all();
  for (const img of imgs) {
    const src = await img.getAttribute('src');
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    if (src && !src.startsWith('data:')) {
      expect(naturalWidth, `Изображение не загрузилось: ${src}`).toBeGreaterThan(0);
    }
  }
});

test('мобильный вид — главная', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('networkidle');
  await page.screenshot({
    path: 'test-results/screenshots/home-mobile.png',
    fullPage: true,
  });
});
