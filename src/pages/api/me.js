// // src/pages/api/me.js
// import { parse } from 'cookie';

// export default function handler(req, res) {
//   try {
//     const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
//     const role = cookies.userRole || null;
//     return res.status(200).json({ role });
//   } catch (err) {
//     console.error('/api/me error', err);
//     return res.status(500).json({ role: null });
//   }
// }


//backend emr-esa
// src/pages/api/me.js (contoh kecil)
import { parse } from 'cookie';

const ALLOWED_ORIGINS = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000,https://emr-ueu.web.app')
  .split(',').map(s => s.trim()).filter(Boolean);

function applyCors(req, res) {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return;
  }
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");

  }
}

export default function handler(req, res) {
  applyCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const role = cookies.userRole || null;
  return res.status(200).json({ role });
}
