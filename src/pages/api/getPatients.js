// import mysql from 'mysql2/promise';
// //code src/pages/api/getPatients.js

// export default async function handler(req, res) {
//     try {
//         const connection = await mysql.createConnection({
//           host: 'localhost',
//           user: 'root',
//           password: 'Bekasibarat12',
//           database: 'emr_db',
//         });
      
//         const [rows] = await connection.query('SELECT * FROM patients');
//         await connection.end();
      
//         res.status(200).json(rows);
//       } catch (error) {
//         console.error('Error fetching patients:', error); // Tambahkan ini untuk melihat pesan error
//         res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//       }
      
// }


// src/pages/api/getPatients.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM patients');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getPatients):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan di server', error: error?.message ?? String(error) });
  }
}
