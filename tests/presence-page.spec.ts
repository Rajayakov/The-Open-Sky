import { test, expect } from '@playwright/test';

const HEADINGS = [
  'Присутствие — Возвращение в центр',
  'Когда ты постоянно находишься у себя в голове',
  'От внутреннего хаоса — к ясности и опоре',
  'Меньше техник. Больше присутствия.',
  'Четыре недели возвращения к себе',
  'Простые инструменты для работы с вниманием',
  'Четыре недели практики с поддержкой',
  'Что ты сможешь изменить в своей повседневной жизни',
  'Яков Раджуна — путь присутствия и осознанности',
  'Для тех, кто готов вернуться к осознанной жизни',
  'Что важно знать перед началом',
  'Формат, продолжительность и стоимость',
  'Начни возвращаться в центр.',
];
const WEEKS = ['Неделя 1 — Остановка хаоса', 'Неделя 2 — Сборка внимания', 'Неделя 3 — Стабилизация состояния', 'Неделя 4 — Интеграция в жизнь'];

test('Presence landing: 13 sections in order, one h1, four weeks', async ({ request }) => {
  const res = await request.get('/programs');
  expect(res.status()).toBe(200);
  const html = await res.text();
  const tags = [...html.matchAll(/<(h[123])[^>]*>([\s\S]*?)<\/\1>/g)]
    .map((m) => [m[1], m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()]);
  const main = tags.filter(([t, txt]) => t !== 'h3' || WEEKS.includes(txt)).filter(([t]) => t !== 'h3');
  // The CTA section renders its own h2; footer headings are not h1/h2/h3 content of the page.
  const texts = main.map(([, txt]) => txt).filter((t) => HEADINGS.includes(t));
  expect(texts).toEqual(HEADINGS);
  expect(main.filter(([t]) => t === 'h1')).toHaveLength(1);
  expect(tags.filter(([t]) => t === 'h3').map(([, x]) => x)).toEqual(expect.arrayContaining(WEEKS));
});

test('/programs is the program itself; old hub offerings are not shown', async ({ request }) => {
  const html = await (await request.get('/programs')).text();
  expect(html).not.toMatch(/Inner Cartography|Fire Season|Roots &amp; Direction/);
});
