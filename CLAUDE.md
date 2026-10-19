# CLAUDE.md — Rajuna Site

## Context files (read only when needed for copy/positioning/audience decisions)
- `context/docs/SYSTEM_PROMPT.md` — who Yakov Rajuna is, voice, projects
- `context/docs/Projects_AI_Optimized.md` — full product matrix

## Identity
Cinematic ceremonial digital environment. NOT startup / SaaS / wellness app / coaching / retreat marketplace.
Focus: THE PROJECT, THE FIELD, THE EXPERIENCE. Yakov = founder, guide, architect. Not guru, not influencer.

## Visual Language
Sacred minimalism. Cinematic editorial. Luxury restraint. Atmospheric depth. Modern temple aesthetics.
Feel: expensive, calm, timeless.

## Forbidden
- Startup/SaaS UI patterns, generic Tailwind, loud gradients, neon, psychedelic clichés
- Overanimated interactions, card grids, template feeling, AI luxury sameness
- Marketplace/catalogue/coaching energy, generic wellness design

## Colors
Palette: warm ivory → parchment → champagne → muted gold → warm graphite → deep bronze → warm black.
Accents: sacred amber, sunlight gold, soft bronze.
Gradient: site darkens top→bottom (lighter/airy top, deeper/cinematic bottom).
Avoid: pure white, cold grays, bright blues, purple gradients.

## Typography
High-end editorial serif. Cinematic luxury hierarchy. Headlines: large, cinematic, intentional.
Micro labels: uppercase, tracked, minimal. Avoid startup/trendy fonts.

## Layout
Massive spacing. Breathe. Every section = a chapter. Avoid dense layouts, boxed UI, uniform sections.
Scrolling = descending deeper into layers.

## Motion
Subtle, cinematic, slow. Fade / reveal / opacity / soft parallax. No flashy animation, no startup patterns.

## UX Journey
Atmosphere → curiosity → depth → pathways → world → ecosystem. Ceremonial, not transactional.

## Site Structure
Pages: Home, Retreats, Mountains, Programs, Mentorship, Music, About, Connect.
Homepage: Hero → Presence → Product worlds → Featured experience → Testimonials → Community → Footer.
Products = worlds, not cards. Every section: immersive, spacious, cinematic, emotional.

## Social
Hero + Footer: Telegram, Instagram, YouTube, Email.

## Testimonials
Quiet, intimate, elegant quotes. Minimal styling. Under each product category.

## Workflow Rules
1. NEVER randomly redesign sections or change colors casually
2. ALWAYS preserve consistency, reuse systems and components
3. Think modularly and cinematically
4. Preserve emotional tone — build like a premium digital studio

## When Uncertain
Choose: restraint, silence, atmosphere, simplicity, depth, rhythm.
Never choose: noise, trendiness, generic luxury, template aesthetics, overdesign.

## Лендинг Аннапурны 2027 (`/mountains/annapurna-2027`)
Отдельный статический лендинг, живёт вне дизайн-системы выше. Эти правила имеют приоритет для него.
- Файл: `src/pages/mountains/annapurna-2027.html`, ассеты `public/annapurna-2027/`. Источник правды: HTML в репозитории. Прод: https://annapurna-pilgrimage-2027.vercel.app/mountains/annapurna-2027
- Порядок выкладки, без исключений: правка в ветку `annapurna-landing-ru-akari` → дождаться деплоя → проверить превью → только потом в main (`git push origin HEAD:main`). Одним пушем в обе ветки не пушить.
- Перед правкой: `git pull`. Автор коммита должен быть в команде Vercel.
- Пути ассетов абсолютные: `/annapurna-2027/...`. Картинки только WebP (~q78, до 1600 px). Тот же файл не перезаписывать: кэш 7 дней, при замене давать новое имя. Шрифты в `public/annapurna-2027/fonts/` урезаны по символам, кэш год.
- Проверка перед выкладкой: `npm run build && npm run qa` (оверфлоу 300–1000 px, 404, Lighthouse mobile и desktop). Должно быть: оверфлоу нет, mobile perf ≥ 95, LCP ≤ 2 с. Нужен Chromium: `CHROME_PATH=/путь/к/chrome npm run qa` или `npx playwright install chromium`.
- Telegram кэширует превью ссылки: после правки og добавлять `?v=N` или чистить в @WebpageBot. og-картинка `public/annapurna-2027/img/og.jpg` остаётся JPG.
- Форма регистрации: Google Форма (ссылка в HTML). В описании формы строку про видеозвонок не трогать (решение Якова).
- Решено: группа до 15 человек; «300+ ретритов», «22+ года», «3 000+ человек»; Immersion 10–15 апреля, 6 ночей; название «Паломничество к Аннапурне 2027»; hero-заголовок на английском.
- Правка текста и цифр на странице: сначала сверить с `claude/annapurna-ru-landing-handoff.md` (проект «The Open Sky»), не менять решённое без команды Якова.

## Формат отчёта Якову
До 10 строк, по-русски, без воды: что сделано, что сломано, что нужно от него. Подробности только по запросу. Файлы целиком и длинные страницы не читать: искать по ним (`grep`). Скриншоты только для проверки вёрстки.
