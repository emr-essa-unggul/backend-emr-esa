// import mysql from 'mysql2/promise';
// //code src/pages/api/getAllNoRM.js

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       // Membuat koneksi ke database
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       // Query untuk mendapatkan semua noRM
//       const [rows] = await connection.query('SELECT noRM FROM daftarpatients');
//       await connection.end();

//       if (rows.length > 0) {
//         res.status(200).json(rows.map(row => row.noRM)); // Kirim daftar noRM sebagai array
//       } else {
//         res.status(404).json({ message: 'Tidak ada nomor rekam medis yang ditemukan' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     res.status(405).end(`Method ${req.method} tidak diizinkan`);
//   }
// }



// src/pages/api/getAllNoRM.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.setHeader('Allow', ['GET']) && res.status(405).end(`Method ${req.method} tidak diizinkan`);

  try {
    const pool = getPool();

    const [rows] = await pool.query('SELECT noRM FROM daftarpatients');

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Tidak ada nomor rekam medis yang ditemukan' });
    }

    const arr = rows.map(r => r.noRM);
    return res.status(200).json(arr);
  } catch (error) {
    console.error('🔥 SQL Error (getAllNoRM):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server', error: error?.message ?? String(error) });
  }
}
