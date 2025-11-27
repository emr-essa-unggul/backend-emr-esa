// // src/pages/api/db-test.js
// import { getPool } from '@/lib/db';

// export default async function handler(req, res) {
//   try {
//     const pool = getPool();
//     // simple test query
//     const [rows] = await pool.query('SELECT NOW() AS now');
//     return res.status(200).json({ ok: true, now: rows?.[0]?.now ?? null });
//   } catch (err) {
//     // return full error for debugging (remove later)
//     console.error('DB TEST ERROR', err);
//     return res.status(500).json({
//       ok: false,
//       message: err.message,
//       stack: err.stack,
//       code: err.code || null,
//     });
//   }
// }



// src/pages/api/db-test.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT NOW() AS now, 1+1 AS v');
    return res.status(200).json({ ok: true, rows });
  } catch (err) {
    console.error('DB TEST ERROR (serverless):', err);
    return res.status(500).json({
      ok: false,
      message: err.message,
      code: err.code || null,
      stack: String(err.stack || '').split('\n').slice(0,6),
    });
  }
}
