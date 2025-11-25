// import mysql from 'mysql2/promise';
// //code src/pages/api/addAntrianFarmasi.js
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const {
//       noRM,
//       namaPenanggungJawab,
//       tanggal,
//       poliklinikTujuan,
//       dokter,
//       pembayaran,
//       status,
//     } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         `INSERT INTO antrian_farmasi 
//          (noRM, namaPenanggungJawab, tanggal, poliklinikTujuan, dokter, pembayaran, status) 
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [noRM, namaPenanggungJawab, tanggal?.split('T')[0], poliklinikTujuan, dokter, pembayaran, status]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Berhasil menambahkan ke antrian farmasi' });
//     } catch (error) {
//       console.error('🔥 SQL Error:', error.message);
//       res.status(500).json({ message: 'Gagal menyimpan ke antrian farmasi', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }




// src/pages/api/addAntrianFarmasi.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const {
    noRM,
    namaPenanggungJawab,
    tanggal,
    poliklinikTujuan,
    dokter,
    pembayaran,
    status,
  } = req.body;

  try {
    const pool = getPool();

    const tanggalFmt = tanggal ? tanggal.split('T')[0] : null;

    const sql = `
      INSERT INTO antrian_farmasi
      (noRM, namaPenanggungJawab, tanggal, poliklinikTujuan, dokter, pembayaran, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      noRM || null,
      namaPenanggungJawab || null,
      tanggalFmt,
      poliklinikTujuan || null,
      dokter || null,
      pembayaran || null,
      status || null,
    ]);

    return res.status(200).json({ message: 'Berhasil menambahkan ke antrian farmasi' });
  } catch (error) {
    console.error('🔥 SQL Error (addAntrianFarmasi):', error);
    return res.status(500).json({
      message: 'Gagal menyimpan ke antrian farmasi',
      error: error?.message ?? String(error),
    });
  }
}
