// // API handler for saving assessment in /pages/api/saveProsesAssessment.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/saveProsesAssessment.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { pasienId, denyutJantung, pernapasan, suhu, tingkatKesadaran, tekananSistol, tekananDiastol, beratBadan, tinggiBadan, keluhan, riwayatPenyakit, riwayatAlergi, riwayatPengobatan, pemeriksaan } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         `INSERT INTO proses_assessment (pasienId, denyutJantung, pernapasan, suhu, tingkatKesadaran, tekananSistol, tekananDiastol, beratBadan, tinggiBadan, keluhan, riwayatPenyakit, riwayatAlergi, riwayatPengobatan, pemeriksaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [pasienId, denyutJantung, pernapasan, suhu, tingkatKesadaran, tekananSistol, tekananDiastol, beratBadan, tinggiBadan, keluhan, riwayatPenyakit, riwayatAlergi, riwayatPengobatan, pemeriksaan]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Data assessment berhasil disimpan.' });
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data.', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/saveProsesAssessment.js
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

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const {
    pasienId, denyutJantung, pernapasan, suhu, tingkatKesadaran, tekananSistol, tekananDiastol,
    beratBadan, tinggiBadan, keluhan, riwayatPenyakit, riwayatAlergi, riwayatPengobatan, pemeriksaan
  } = req.body;

  if (!pasienId) return res.status(400).json({ message: 'pasienId wajib diisi' });

  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO proses_assessment (
        pasienId, denyutJantung, pernapasan, suhu, tingkatKesadaran, tekananSistol, tekananDiastol,
        beratBadan, tinggiBadan, keluhan, riwayatPenyakit, riwayatAlergi, riwayatPengobatan, pemeriksaan, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [pasienId, denyutJantung || null, pernapasan || null, suhu || null, tingkatKesadaran || null, tekananSistol || null, tekananDiastol || null, beratBadan || null, tinggiBadan || null, keluhan || null, riwayatPenyakit || null, riwayatAlergi || null, riwayatPengobatan || null, pemeriksaan ? JSON.stringify(pemeriksaan) : null]
    );

    return res.status(200).json({ message: 'Data assessment berhasil disimpan.' });
  } catch (error) {
    console.error('🔥 SQL Error (saveProsesAssessment):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data.', error: error?.message ?? String(error) });
  }
}
