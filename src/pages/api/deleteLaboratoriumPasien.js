// // pages/api/deleteLaboratoriumPasien.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/deleteLaboratoriumPasien.js

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { noRM, kode } = req.body;
//   if (!noRM || !kode) return res.status(400).json({ message: 'Invalid input' });

//   const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'Bekasibarat12', database: 'emr_db' });

//   try {
//     await conn.query('DELETE FROM laboratorium_pasien WHERE noRM = ? AND kode_lab = ?', [noRM, kode]);
//     await conn.end();
//     return res.status(200).json({ message: 'Data dihapus' });
//   } catch (err) {
//     console.error('❌ Error delete:', err);
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// }



// src/pages/api/deleteLaboratoriumPasien.js
import { getPool } from '@/lib/db';
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://emr-ueu.web.app',
  'https://emr-ueu.firebaseapp.com', // jika perlu
  // tambahkan origin lain yang harus diizinkan
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // Set CORS headers if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    // Jika front-end butuh mengirim cookie/session, aktifkan credentials dan pastikan origin bukan '*'
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    // Permintaan server-to-server (curl, internal) mungkin tidak punya origin -> izinkan
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Origin tidak diizinkan -> jangan set Access-Control-Allow-Origin atau kembalikan 403 untuk OPTIONS/GET/POST khususnya
    // Kita tetap lanjutkan supaya response memiliki no-cors di browser (browser akan block client-side).
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { noRM, kode } = req.body;
  if (!noRM || !kode) return res.status(400).json({ message: 'Invalid input' });

  try {
    const pool = getPool();

    const [result] = await pool.query(
      'DELETE FROM laboratorium_pasien WHERE noRM = ? AND kode_lab = ?',
      [noRM, kode]
    );

    // optionally check affectedRows
    if (result && result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    return res.status(200).json({ message: 'Data dihapus' });
  } catch (err) {
    console.error('🔥 SQL Error (deleteLaboratoriumPasien):', err);
    return res.status(500).json({ message: 'Server error', error: err?.message ?? String(err) });
  }
}
