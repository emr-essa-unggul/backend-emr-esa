// import mysql from 'mysql2/promise';
// //code src/pages/api/getDaftarPatient.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db'
//     });

//     const [rows] = await connection.query('SELECT * FROM daftarpatients ORDER BY createdAt DESC');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengambil data pasien', error: error.message });
//   }
// }




// src/pages/api/getDaftarPatient.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method tidak diizinkan' });

  try {
    const pool = getPool();

    const [rows] = await pool.query('SELECT * FROM daftarpatients ORDER BY createdAt DESC');

    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getDaftarPatient):', error);
    return res.status(500).json({ message: 'Gagal mengambil data pasien', error: error?.message ?? String(error) });
  }
}
