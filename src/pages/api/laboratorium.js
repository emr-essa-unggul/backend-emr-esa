// // pages/api/laboratorium.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/laboratorium.js
// export default async function handler(req, res) {
//   const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'Bekasibarat12',
//     database: 'emr_db',
//   };

//   try {
//     const conn = await mysql.createConnection(dbConfig);

//     // ✅ GET data master laboratorium
//     if (req.method === 'GET') {
//       const [rows] = await conn.execute(
//         'SELECT id_loinclab, code AS kode_lab, nama_pemeriksaan AS nama_lab FROM master_data_laboratorium'
//       );
//       await conn.end();
//       return res.status(200).json(rows);
//     }

//     // ✅ POST simpan pilihan laboratorium berdasarkan pasien
//     if (req.method === 'POST') {
//       const { noRM, laboratorium } = req.body;

//       if (!noRM || !Array.isArray(laboratorium)) {
//         return res.status(400).json({ message: 'Data tidak valid.' });
//       }

//       // Hapus data lama
//       await conn.query('DELETE FROM laboratorium_pasien WHERE noRM = ?', [noRM]);

//       // Simpan data baru
//       for (const lab of laboratorium) {
//         if (!lab.kode || !lab.nama) {
//           console.warn('❗ Data laboratorium tidak lengkap, dilewati:', lab);
//           continue;
//         }

//         await conn.query(
//           'INSERT INTO laboratorium_pasien (noRM, kode_lab, nama_lab) VALUES (?, ?, ?)',
//           [noRM, lab.kode, lab.nama]
//         );
//       }

// //       // Ambil data laboratorium berdasarkan noRM
// // if (req.method === 'GET' && req.query.noRM) {
// //   const [rows] = await conn.query(
// //     'SELECT kode_lab AS kode, nama_lab AS nama FROM laboratorium_pasien WHERE noRM = ?',
// //     [req.query.noRM]
// //   );
// //   await conn.end();
// //   return res.status(200).json(rows);
// // }


//       await conn.end();
//       return res.status(200).json({ message: 'Data laboratorium berhasil disimpan' });
//     }

//     // Method lain tidak diizinkan
//     await conn.end();
//     return res.status(405).json({ message: 'Method not allowed' });

//   } catch (error) {
//     console.error('Database Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//   }
// }




// src/pages/api/laboratorium.js
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

  try {
    const pool = getPool();

    // GET master data laboratorium
    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT id_loinclab, code AS kode_lab, nama_pemeriksaan AS nama_lab FROM master_data_laboratorium');
      return res.status(200).json(rows);
    }

    // POST simpan pilihan laboratorium pasien
    if (req.method === 'POST') {
      const { noRM, laboratorium } = req.body;

      if (!noRM || !Array.isArray(laboratorium)) {
        return res.status(400).json({ message: 'Data tidak valid.' });
      }

      // Hapus data lama
      await pool.query('DELETE FROM laboratorium_pasien WHERE noRM = ?', [noRM]);

      // Simpan data baru (skip incomplete items)
      const insertPromises = laboratorium
        .filter(lab => lab && lab.kode && lab.nama)
        .map(lab => pool.query('INSERT INTO laboratorium_pasien (noRM, kode_lab, nama_lab) VALUES (?, ?, ?)', [noRM, lab.kode, lab.nama]));

      await Promise.all(insertPromises);

      return res.status(200).json({ message: 'Data laboratorium berhasil disimpan' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('🔥 SQL Error (laboratorium):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
