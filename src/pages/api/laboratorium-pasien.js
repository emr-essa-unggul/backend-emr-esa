// // pages/api/laboratorium-pasien.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/laboratorium-pasien.js

// export default async function handler(req, res) {
//   const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'Bekasibarat12',
//     database: 'emr_db',
//   };

//   try {
//     const conn = await mysql.createConnection(dbConfig);

//     // ✅ GET data laboratorium berdasarkan noRM
//     if (req.method === 'GET' && req.query.noRM) {
//       const [rows] = await conn.query(
//         'SELECT kode_lab AS kode, nama_lab AS nama FROM laboratorium_pasien WHERE noRM = ?',
//         [req.query.noRM]
//       );
//       await conn.end();
//       return res.status(200).json(rows);
//     }

//     await conn.end();
//     return res.status(400).json({ message: 'noRM tidak diberikan' });
//   } catch (error) {
//     console.error('❌ API Error - laboratorium-pasien:', error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }




// src/pages/api/laboratorium-pasien.js
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
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
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

  try {
    const pool = getPool();

    // GET data laboratorium per pasien (by noRM)
    if (req.method === 'GET' && req.query.noRM) {
      const [rows] = await pool.query('SELECT kode_lab AS kode, nama_lab AS nama FROM laboratorium_pasien WHERE noRM = ?', [req.query.noRM]);
      return res.status(200).json(rows);
    }

    return res.status(400).json({ message: 'noRM tidak diberikan' });
  } catch (error) {
    console.error('🔥 SQL Error (laboratorium-pasien):', error);
    return res.status(500).json({ message: 'Server error', error: error?.message ?? String(error) });
  }
}
