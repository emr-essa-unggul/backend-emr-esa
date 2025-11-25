// import mysql from 'mysql2/promise';
// //code src/pages/api/getAntrianData.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db'
//     });

//     const [rows] = await connection.query('SELECT * FROM antrian_pemeriksaan ORDER BY createdAt DESC');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Database Error:', error);
//     res.status(500).json({ message: 'Gagal mengambil data antrian', error: error.message });
//   }
// }



// src/pages/api/getAntrianData.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();

    const [rows] = await pool.query('SELECT * FROM antrian_pemeriksaan ORDER BY createdAt DESC');

    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getAntrianData):', error);
    return res.status(500).json({ message: 'Gagal mengambil data antrian', error: error?.message ?? String(error) });
  }
}
