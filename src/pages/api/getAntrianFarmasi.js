// import mysql from 'mysql2/promise';
// //code src/pages/api/getAntrianFarmasi.js

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       // Ambil data dari tabel antrian_farmasi yang sudah menyelesaikan pembayaran
//       const [rows] = await connection.query(
//         `SELECT id, noRM, namaPenanggungJawab, tanggal, poliklinikTujuan, dokter, pembayaran, status
//          FROM antrian_farmasi
//          WHERE status = 'Selesai Pembayaran'`
//       );

//       await connection.end();
//       res.status(200).json(rows);
//     } catch (error) {
//       console.error('Database error:', error);
//       res.status(500).json({ message: 'Gagal mengambil data antrian farmasi', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }




// src/pages/api/getAntrianFarmasi.js
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

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method tidak diizinkan' });

  try {
    const pool = getPool();

    const [rows] = await pool.query(
      `SELECT id, noRM, namaPenanggungJawab, tanggal, poliklinikTujuan, dokter, pembayaran, status
       FROM antrian_farmasi
       WHERE status = 'Selesai Pembayaran'`
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getAntrianFarmasi):', error);
    return res.status(500).json({ message: 'Gagal mengambil data antrian farmasi', error: error?.message ?? String(error) });
  }
}
