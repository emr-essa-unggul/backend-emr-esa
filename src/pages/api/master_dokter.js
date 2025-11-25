// import mysql from 'mysql2/promise';
// //code src/pages/api/master_dokter.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     // const [rows] = await connection.query('SELECT * FROM master_data_dokter');
//     const [rows] = await connection.query('SELECT id_dokter, nama_dokter FROM master_data_dokter');

//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching dokter:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//   }
// }


// src/pages/api/master_dokter.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT id_dokter, nama_dokter FROM master_data_dokter');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (master_dokter):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan di server', error: error?.message ?? String(error) });
  }
}
