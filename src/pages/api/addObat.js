// import mysql from 'mysql2/promise';
// //code src/pages/api/addObat.js
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS } = req.body;

//     if (!kodeObat || !namaObat || !namaSupplier || !noBatch || !sediaanObat || !stokObat || !hargaBeli || !hargaJualUmum || !hargaJualBPJS) {
//       return res.status(400).json({ message: 'Harap isi semua field' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         'INSERT INTO obat (kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//         [kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Obat berhasil ditambahkan' });
//     } catch (error) {
//       console.error('Error inserting obat:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/addObat.js
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

  const { kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS } = req.body;

  if (!kodeObat || !namaObat || !namaSupplier || !noBatch || !sediaanObat || (stokObat === undefined) || !hargaBeli || !hargaJualUmum || !hargaJualBPJS) {
    return res.status(400).json({ message: 'Harap isi semua field' });
  }

  try {
    const pool = getPool();

    const tanggalLahirFmt = tanggalLahir ? String(tanggalLahir).split('T')[0] : null;

    const sql = `
      INSERT INTO obat (
        kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      kodeObat,
      namaObat,
      namaSupplier,
      noBatch,
      sediaanObat,
      Number(stokObat) || 0,
      tanggalLahirFmt,
      hargaBeli,
      hargaJualUmum,
      hargaJualBPJS,
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Obat berhasil ditambahkan' });
  } catch (error) {
    console.error('🔥 SQL Error (addObat):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
