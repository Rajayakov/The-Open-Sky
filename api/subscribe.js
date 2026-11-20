// Серверная функция Vercel: принимает форму и запускает Double Opt-in в Brevo.
// Ключ BREVO_API_KEY живёт только в переменных окружения, в клиент и в Git не попадает.
import materials from '../src/data/materials.json' with { type: 'json' };
import { makeToken } from './_token.js';

const LIST_ID = 3; // RAJUNA — Leads
const TEMPLATE_ID = Number(process.env.BREVO_DOI_TEMPLATE_ID || 1); // шаблон подтверждения
const BREVO_URL = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const hits = new Map(); // простой лимит по IP, в пределах одного экземпляра функции

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(body));
}

function throttled(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method' });

  const key = process.env.BREVO_API_KEY;
  if (!key) return json(res, 500, { ok: false, error: 'not_configured' });

  // Только с того же сайта
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '');
  const origin = String(req.headers.origin || '');
  try {
    if (!origin || new URL(origin).host !== host) return json(res, 403, { ok: false, error: 'origin' });
  } catch {
    return json(res, 403, { ok: false, error: 'origin' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (throttled(ip)) return json(res, 429, { ok: false, error: 'rate' });

  let b = req.body;
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch { b = null; }
  }
  if (!b || typeof b !== 'object') return json(res, 400, { ok: false, error: 'invalid' });

  // Ловушка для ботов: поле скрыто, человек его не заполняет. Отвечаем «успех», ничего не отправляем.
  if (b.website) return json(res, 200, { ok: true });

  const email = String(b.email || '').trim().toLowerCase();
  const firstName = String(b.firstName || '').trim().slice(0, 80);
  const lang = b.lang === 'en' ? 'en' : 'ru';
  const material = materials.materials.find((m) => m.slug === b.slug);
  if (!EMAIL_RE.test(email) || email.length > 200 || !firstName || !material) {
    return json(res, 400, { ok: false, error: 'invalid' });
  }
  const source = String(b.source || 'direct').replace(/[^\w.\-:/]/g, '').slice(0, 100) || 'direct';

  const attributes = {
    FIRSTNAME: firstName,
    LANGUAGE_PREF: lang.toUpperCase(),
    LEAD_SOURCE: source,
    LEAD_MAGNET: material.slug,
  };
  // Согласие передаём только если галочка стоит. Иначе поля не отправляем вообще,
  // чтобы повторная заявка не сбросила уже данное согласие.
  if (b.consent === true) {
    attributes.CONSENT_MARKETING = true;
    attributes.CONSENT_DATE = new Date().toISOString().slice(0, 10);
  }

  const proto = /^localhost/.test(host) ? 'http' : 'https';
  const prefix = lang === 'en' ? '/en' : '';
  // Адрес со знаком доступа знает только Brevo: человек увидит его после клика по ссылке подтверждения.
  const isFirst = materials.materials[0].slug === material.slug;
  const path = isFirst ? '/free/ok' : `/free/${material.slug}/ready`;
  const redirectionUrl = `${proto}://${host}${prefix}${path}?t=${makeToken(material.slug, lang)}`;

  try {
    const r = await fetch(BREVO_URL, {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        email,
        attributes,
        includeListIds: [LIST_ID],
        templateId: TEMPLATE_ID,
        redirectionUrl,
      }),
    });
    if (r.status === 201 || r.status === 204) return json(res, 200, { ok: true });
    let detail = '';
    try { detail = (await r.json()).message || ''; } catch { /* пустой ответ */ }
    console.error('brevo_error', r.status, detail.slice(0, 200)); // без email и ключа
    return json(res, 502, { ok: false, error: 'upstream' });
  } catch (e) {
    console.error('brevo_fetch_failed', e && e.name);
    return json(res, 502, { ok: false, error: 'upstream' });
  }
}
