// // /pages/api/saveDiagnosa.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/saveDiagnosa.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noRM, diagnosa } = req.body;

//     try {
//       const conn = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       // Optional: hapus diagnosa lama untuk noRM ini dulu
//       await conn.query('DELETE FROM diagnosa WHERE noRM = ?', [noRM]);

//       // Masukkan diagnosa baru
//       for (const d of diagnosa) {
//         await conn.query(
//           'INSERT INTO diagnosa (noRM, kode_icd_10, nama_diagnosa, versi) VALUES (?, ?, ?, ?)',
//           [noRM, d.kode_icd_10, d.nama_diagnosa, d.versi]
//         );
//       }

//       await conn.end();
//       res.status(200).json({ message: 'Diagnosa disimpan.' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Gagal simpan diagnosa' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }


// src/pages/api/saveDiagnosa.js
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
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app/');
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

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { noRM, diagnosa } = req.body;
  if (!noRM || !Array.isArray(diagnosa)) return res.status(400).json({ error: 'Payload tidak valid' });

  try {
    const pool = getPool();

    // gunakan transaction agar konsisten
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM diagnosa WHERE noRM = ?', [noRM]);

      const insertPromises = diagnosa.map(d =>
        conn.query('INSERT INTO diagnosa (noRM, kode_icd_10, nama_diagnosa, versi) VALUES (?, ?, ?, ?)', [noRM, d.kode_icd_10, d.nama_diagnosa, d.versi])
      );
      await Promise.all(insertPromises);

      await conn.commit();
      conn.release();
      return res.status(200).json({ message: 'Diagnosa disimpan.' });
    } catch (e) {
      await conn.rollback();
      conn.release();
      throw e;
    }
  } catch (err) {
    console.error('🔥 SQL Error (saveDiagnosa):', err);
    return res.status(500).json({ error: 'Gagal simpan diagnosa' });
  }
}
