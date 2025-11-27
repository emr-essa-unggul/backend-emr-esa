// import mysql from 'mysql2/promise';
// //code src/pages/api/addAssessmentAwal.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noAntrian, denyutJantung, pernapasan, suhu, tekananDarahSistol, tekananDarahDiastol, beratBadan, tinggiBadan, keluhanUtama, riwayatPenyakit, riwayatAlergi, riwayatPengobatan } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         `INSERT INTO assessment_awal (noAntrian, denyut_jantung, pernapasan, suhu, tekanan_darah_sistol, tekanan_darah_diastol, berat_badan, tinggi_badan, keluhan_utama, riwayat_penyakit, riwayat_alergi, riwayat_pengobatan)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [noAntrian, denyutJantung, pernapasan, suhu, tekananDarahSistol, tekananDarahDiastol, beratBadan, tinggiBadan, keluhanUtama, riwayatPenyakit, riwayatAlergi, riwayatPengobatan]
//       );

//       res.status(200).json({ message: 'Data assessment awal berhasil disimpan' });
//     } catch (error) {
//       res.status(500).json({ message: 'Gagal menyimpan assessment awal', error: error.message });
//     }
//   }
// }




// src/pages/api/addAssessmentAwal.js
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const {
    noAntrian,
    denyutJantung,
    pernapasan,
    suhu,
    tekananDarahSistol,
    tekananDarahDiastol,
    beratBadan,
    tinggiBadan,
    keluhanUtama,
    riwayatPenyakit,
    riwayatAlergi,
    riwayatPengobatan,
  } = req.body;

  try {
    const pool = getPool();

    const sql = `
      INSERT INTO assessment_awal (
        noAntrian, denyut_jantung, pernapasan, suhu, tekanan_darah_sistol, tekanan_darah_diastol,
        berat_badan, tinggi_badan, keluhan_utama, riwayat_penyakit, riwayat_alergi, riwayat_pengobatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      noAntrian || null,
      denyutJantung || null,
      pernapasan || null,
      suhu || null,
      tekananDarahSistol || null,
      tekananDarahDiastol || null,
      beratBadan || null,
      tinggiBadan || null,
      keluhanUtama || null,
      riwayatPenyakit || null,
      riwayatAlergi || null,
      riwayatPengobatan || null,
    ]);

    return res.status(200).json({ message: 'Data assessment awal berhasil disimpan' });
  } catch (error) {
    console.error('🔥 SQL Error (addAssessmentAwal):', error);
    return res.status(500).json({ message: 'Gagal menyimpan assessment awal', error: error?.message ?? String(error) });
  }
}
