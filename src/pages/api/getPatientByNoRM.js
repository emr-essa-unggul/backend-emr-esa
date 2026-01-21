// import mysql from 'mysql2/promise';
// //code src/pages/api/getPatientByNoRM.js

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { noRM } = req.query; // Ambil noRM dari query parameter
    
//     try {
//       // Membuat koneksi ke database
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       // Query untuk mendapatkan data pasien berdasarkan noRM
//       const [rows] = await connection.query('SELECT * FROM daftarpatients WHERE noRM = ?', [noRM]);
//       await connection.end(); // Tutup koneksi setelah query selesai

//       if (rows.length > 0) {
//         res.status(200).json(rows[0]); // Kirim data pasien pertama yang ditemukan
//       } else {
//         res.status(404).json({ message: 'Pasien tidak ditemukan' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).end(`Method ${req.method} tidak diizinkan`);
//   }
// }




// src/pages/api/getPatientByNoRM.js
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

  if (req.method !== 'GET') return res.setHeader('Allow', ['GET']) && res.status(405).end(`Method ${req.method} tidak diizinkan`);

  const { noRM } = req.query;
  if (!noRM) return res.status(400).json({ message: 'noRM wajib diberikan sebagai query parameter' });

  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM daftarpatients WHERE noRM = ?', [noRM]);

    if (rows && rows.length > 0) return res.status(200).json(rows[0]);
    return res.status(404).json({ message: 'Pasien tidak ditemukan' });
  } catch (error) {
    console.error('🔥 SQL Error (getPatientByNoRM):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server', error: error?.message ?? String(error) });
  }
}
