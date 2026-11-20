// Отдаёт ссылку на материал только тому, кто пришёл по ссылке из подтверждения email.
import materials from '../src/data/materials.json' with { type: 'json' };
import { checkToken } from './_token.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  const { slug, lang, t } = req.query || {};
  const l = lang === 'en' ? 'en' : 'ru';
  const m = materials.materials.find((x) => x.slug === slug);
  if (!m || !checkToken(m.slug, l, t)) return res.status(403).json({ ok: false });
  return res.status(200).json({ ok: true, title: m.title[l], url: m.url[l] || '' });
}
