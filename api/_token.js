// Подпись ссылки на страницу материала. Ключом служит BREVO_API_KEY, отдельный секрет не нужен.
import { createHmac, timingSafeEqual } from 'node:crypto';

const sign = (slug, lang, ts) =>
  createHmac('sha256', process.env.BREVO_API_KEY || '').update(`${slug}|${lang}|${ts}`).digest('hex').slice(0, 40);

export function makeToken(slug, lang) {
  const ts = Date.now().toString(36);
  return `${ts}.${sign(slug, lang, ts)}`;
}

export function checkToken(slug, lang, token) {
  if (!process.env.BREVO_API_KEY || typeof token !== 'string') return false;
  const [ts, sig] = token.split('.');
  if (!ts || !sig || ts.length > 12 || sig.length !== 40) return false;
  const expected = Buffer.from(sign(slug, lang, ts));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
