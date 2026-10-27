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
- Три языковые версии: RU `src/pages/mountains/annapurna-2027.html`, EN `annapurna-2027-en.html`, JA `annapurna-2027-ja.html` (ассеты EN и общие картинки в `public/annapurna-2027/en/`, японский шрифт заголовков в `public/annapurna-2027/ja/fonts/`; форма у EN и JA одна, английская: forms.gle/H42fu7KS5q3yNHiJ6). Переключатель RU | EN | 日本語 (`.lang`) и подсказка языка (`.lang-tip`, только по языку браузера, без автоперенаправления) одинаковые во всех трёх страницах и генерируются `scripts/i18n-ja/build-ja.py`: править там, не руками. Корень `/` на прод-хостах по Accept-Language: японский уходит на JA, русский/украинский/белорусский/казахский остаются на RU, остальные на EN (правила в `vercel.json`).
- Японский текст: источник `scripts/i18n-ja/source-en.md` (блоки с ID из EN), перевод приходит от ChatGPT и вычитывается Акари. Правки EN-текста: `python3 scripts/i18n-ja/extract.py`, затем новый перевод и `python3 scripts/i18n-ja/build-ja.py перевод.txt`, затем `python3 scripts/i18n-ja/subset-fonts.py ПАПКА_TTF` (шрифт под символы заголовков). Японская страница собирается из EN целиком: ручные правки JA-файла перезатрутся, правки в `ja.css` и `OVER` в `build-ja.py`.
- Файл: `src/pages/mountains/annapurna-2027.html`, ассеты `public/annapurna-2027/`. Источник правды: HTML в репозитории. Прод: https://theopensky.vercel.app/mountains/annapurna-2027 (annapurna2027 и annapurna-pilgrimage-2027 редиректят сюда). На продакшен-доменах открыт только лендинг: остальные страницы сайта редиректят на него (правило в `vercel.json`), сайт в разработке
- Порядок выкладки, без исключений: правка в ветку `annapurna-landing-ru-akari` → дождаться деплоя → проверить превью → только потом в main (`git push origin HEAD:main`). Одним пушем в обе ветки не пушить.
- Перед правкой: `git pull`. Автор коммита должен быть в команде Vercel.
- Пути ассетов абсолютные: `/annapurna-2027/...`. Картинки только WebP (~q78, до 1600 px). Тот же файл не перезаписывать: кэш 7 дней, при замене давать новое имя. Шрифты в `public/annapurna-2027/fonts/` урезаны по символам, кэш год.
- Проверка перед выкладкой: `npm run build && npm run qa` (все версии RU, EN и JA: оверфлоу 300–1920 px, 404, Lighthouse mobile и desktop). Должно быть: оверфлоу нет, mobile perf ≥ 95, LCP ≤ 2 с. Нужен Chromium: `CHROME_PATH=/путь/к/chrome npm run qa` или `npx playwright install chromium`.
- Telegram кэширует превью ссылки: после правки og добавлять `?v=N` или чистить в @WebpageBot. og-картинка `public/annapurna-2027/img/og.jpg` остаётся JPG.
- Форма регистрации: Google Форма (ссылка в HTML). В описании формы строку про видеозвонок не трогать (решение Якова).
- Решено: группа до 15 человек; «300+ ретритов», «22+ года», «3 000+ человек»; Immersion 10–15 апреля, 6 ночей; название «Паломничество к Аннапурне 2027»; hero-заголовок на английском.
- Правка текста и цифр на странице: сначала сверить с `claude/annapurna-ru-landing-handoff.md` (проект «The Open Sky»), не менять решённое без команды Якова.

## Формат отчёта Якову
До 10 строк, по-русски, без воды: что сделано, что сломано, что нужно от него. Подробности только по запросу. Файлы целиком и длинные страницы не читать: искать по ним (`grep`). Скриншоты только для проверки вёрстки.

## Роли: Claude desktop и Claude Code
Основной исполнитель: Claude в десктопном приложении (облачная сессия). Он правит лендинг, коммитит, выкладывает превью → main, управляет Vercel (деплои, алиасы, домены, аналитика), гоняет QA и Lighthouse, пишет тексты и документацию, работает в браузере и с Google Формой.
Claude Code (локально у Якова) берёт только то, что требует его Mac: локальный dev-сервер и правки основного сайта в рабочей копии с незакоммиченными файлами, `npm ci` и сборка локально, git на локальных ветках, файлы вне репозитория, локальные приложения и MCP.
- Передача через git: перед работой `git pull`, не править одни и те же файлы одновременно. Ветку `annapurna-landing-ru-akari` и лендинг Claude Code без команды не трогает.
- Задачу для Claude Code формулирует Claude desktop: готовый промт до 10 строк (что, в каких файлах, как проверить).
- Экономия токенов: большие файлы и страницы не читать целиком (искать `grep`), скриншоты только для проверки вёрстки, деплой не опрашивать циклом, один `npm run qa` перед выкладкой, отчёт до 10 строк. Новая тема, новая сессия: контекст берётся из этого файла и заметки проекта.

## Статус сайта Open Sky
Сайт Open Sky (все страницы кроме лендинга Аннапурны) в разработке и для публики закрыт. Публично открыт только лендинг Аннапурны (RU и EN): на продакшен-хостах остальные страницы редиректят на него (`vercel.json`).
- Основная рабочая версия Open Sky: https://the-open-sky-preview.vercel.app (алиас вручную перекидывается на свежий деплой main: `assign_alias` после каждого деплоя main). На странице внизу слева пометка «В разработке · не для публики», у всех страниц на `Base.astro` стоит `noindex, nofollow`. Пометка показывается на любом хосте, кроме продакшен-хостов (список в `Base.astro`).
- Рабочие правки сайта: ветка `open-sky-site` от main, превью ветки, потом main. Ветку `design-system-sync` и алиас `the-open-sky-preview` без команды Якова не трогать.
- Снимок последней полной версии до лендингов: https://the-open-sky-oct14.vercel.app (main на 14.10.2026, коммит 4b153e3).

## Context7 (свежая документация библиотек)
Коннектор Context7 подключён в аккаунте Якова (claude.ai, Connectors). Когда нужен точный синтаксис или настройка библиотеки (Astro, Playwright, Vercel, Tailwind), сначала спросить Context7, а не писать по памяти. Для лендингов (статический HTML) почти не нужен.
- Astro: `/withastro/docs` (основные доки). В нашем `package.json` Astro ^7.0.1, а у `/withastro/astro` в Context7 версия 6.3.1: детали, которые могли поменяться в 7, сверять с `node_modules/astro` или официальным сайтом.
- Не больше 3 запросов на один вопрос. В запросы не класть ключи, пароли и личные данные.
- Если инструменты Context7 в сессии не появились, значит коннектор не включён для этого чата: сказать Якову, не выдумывать ответ.

## Референсы и вдохновение (Awwwards и любые чужие сайты)
Open Sky авторский сайт. Референсы нужны, чтобы найти сильные приёмы, а не чтобы перенять чужое лицо.
- Брать можно: принципы. Ритм секций, длину пауз, работу с тишиной и пустотой, типографскую иерархию, логику перехода между экранами, темп и характер движения, способ вести взгляд.
- Нельзя: копировать композицию экрана целиком, сетку один к одному, тексты, фото, иллюстрации, фирменные детали, узнаваемые анимации. Если результат можно узнать как «тот самый сайт», он не подходит.
- Фильтр до применения. Каждый приём проходит через «Identity», «Forbidden» и «Visual Language» выше и через `.claude/skills/sacred-lixury-direction.md`. Не проходит, отбрасываем, даже если выглядит эффектно. Особенно режем: стартап-вид, карточные сетки, яркие градиенты, неон, перегруз анимацией, «дорогой, но как у всех».
- Формат разбора для Якова, до 10 строк: какой приём, у кого он работает и почему, как он ляжет на наш язык (цвет, шрифт, темп), что именно мы меняем, чтобы это было нашим, риск.
- Ищем 3–5 референсов под одну задачу, не больше. Сначала приём, потом предложение на нашем материале, потом правка кода. Решение за Яковом.
- Инструмент: Awwwards-mcp (локально на Mac в Claude Code, `claude mcp add awwwards -- npx -y awwwards-mcp`). Только личное некоммерческое использование, анализировать можно сайты, которые разрешено смотреть. В облачной сессии Claude он недоступен (сайт Awwwards оттуда не открывается).
