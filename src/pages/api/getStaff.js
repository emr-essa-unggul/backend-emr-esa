// import mysql from 'mysql2/promise';
// //code src/pages/api/getStaff.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query('SELECT * FROM staff');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching staff:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//   }
// }



// src/pages/api/getStaff.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM staff');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getStaff):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan di server', error: error?.message ?? String(error) });
  }
}
