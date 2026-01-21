// import mysql from 'mysql2/promise';
// //code src/pages/api/addDokter.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { kodeDokter, namaDokter, jenisKelamin, nik, noTelepon, alamat, spesialis, noIzinPraktek, noSTR, hargaKonsultasi, username, kataSandi } = req.body;

//     if (!kodeDokter || !namaDokter || !jenisKelamin || !username || !kataSandi) {
//       return res.status(400).json({ message: 'Harap isi semua field yang wajib' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         'INSERT INTO dokter (kodeDokter, namaDokter, jenisKelamin, nik, noTelepon, alamat, spesialis, noIzinPraktek, noSTR, hargaKonsultasi, username, kataSandi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//         [kodeDokter, namaDokter, jenisKelamin, nik, noTelepon, alamat, spesialis, noIzinPraktek, noSTR, hargaKonsultasi, username, kataSandi]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Dokter berhasil ditambahkan' });
//     } catch (error) {
//       console.error('Error inserting dokter:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }




// src/pages/api/addDokter.js
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


  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { kodeDokter, namaDokter, jenisKelamin, nik, noTelepon, alamat, spesialis, noIzinPraktek, noSTR, hargaKonsultasi, username, kataSandi } = req.body;

  if (!kodeDokter || !namaDokter || !jenisKelamin || !username || !kataSandi) {
    return res.status(400).json({ message: 'Harap isi semua field yang wajib' });
  }

  try {
    const pool = getPool();

    // NOTE: jangan simpan password plain-text di production => gunakan bcrypt
    const sql = `
      INSERT INTO dokter (
        kodeDokter, namaDokter, jenisKelamin, nik, noTelepon, alamat,
        spesialis, noIzinPraktek, noSTR, hargaKonsultasi, username, kataSandi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      kodeDokter,
      namaDokter,
      jenisKelamin,
      nik || null,
      noTelepon || null,
      alamat || null,
      spesialis || null,
      noIzinPraktek || null,
      noSTR || null,
      hargaKonsultasi || null,
      username,
      kataSandi, // sebaiknya hash ini sebelum disimpan
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Dokter berhasil ditambahkan' });
  } catch (error) {
    console.error('🔥 SQL Error (addDokter):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
