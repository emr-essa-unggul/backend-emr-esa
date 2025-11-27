// import mysql from 'mysql2/promise';
// //code src/pages/api/updateStatusAssessment.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noAntrian, status } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         'UPDATE status_assessment SET status = ? WHERE noAntrian = ?',
//         [status, noAntrian]
//       );

//       res.status(200).json({ message: 'Status berhasil diperbarui' });
//     } catch (error) {
//       res.status(500).json({ message: 'Gagal memperbarui status', error: error.message });
//     }
//   }
// }




// src/pages/api/updateStatusAssessment.js
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

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { noAntrian, status } = req.body;
  if (!noAntrian || !status) return res.status(400).json({ message: 'noAntrian dan status wajib disertakan' });

  try {
    const pool = getPool();
    const [result] = await pool.query('UPDATE status_assessment SET status = ? WHERE noAntrian = ?', [status, noAntrian]);

    if (result && result.affectedRows > 0) {
      return res.status(200).json({ message: 'Status berhasil diperbarui' });
    } else {
      return res.status(404).json({ message: 'Record tidak ditemukan' });
    }
  } catch (error) {
    console.error('🔥 SQL Error (updateStatusAssessment):', error);
    return res.status(500).json({ message: 'Gagal memperbarui status', error: error?.message ?? String(error) });
  }
}
