// import mysql from 'mysql2/promise';
// //code src/pages/api/updateStatusAntrian.js
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { id, status } = req.body;

//     if (!id || !status) {
//       return res.status(400).json({ message: 'ID dan status wajib diisi.' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       // Update status pada antrian berdasarkan ID
//       const [result] = await connection.query(
//         'UPDATE antrian_pemeriksaan SET status = ? WHERE id = ?',
//         [status, id]
//       );

//       await connection.end();

//       if (result.affectedRows > 0) {
//         res.status(200).json({ message: 'Status berhasil diperbarui.' });
//       } else {
//         res.status(400).json({ message: 'Tidak dapat menemukan data antrian yang sesuai.' });
//       }
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/updateStatusAntrian.js
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
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
    
    
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

  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ message: 'ID dan status wajib diisi.' });

  try {
    const pool = getPool();
    const [result] = await pool.query('UPDATE antrian_pemeriksaan SET status = ? WHERE id = ?', [status, id]);

    if (result && result.affectedRows > 0) {
      return res.status(200).json({ message: 'Status berhasil diperbarui.' });
    } else {
      return res.status(404).json({ message: 'Tidak dapat menemukan data antrian yang sesuai.' });
    }
  } catch (error) {
    console.error('🔥 SQL Error (updateStatusAntrian):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error?.message ?? String(error) });
  }
}
