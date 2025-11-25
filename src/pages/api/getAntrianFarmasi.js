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

export default async function handler(req, res) {
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
