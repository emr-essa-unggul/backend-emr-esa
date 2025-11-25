// // pages/api/laboratorium.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/getDataLabolatorium.js

// export default async function handler(req, res) {
//   const connection = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Bekasibarat12',
//     database: 'emr_db'
//   });

//   const [rows] = await connection.query('SELECT code, nama_pemeriksaan AS nama FROM master_data_laboratorium');
//   res.status(200).json(rows);
// }



// src/pages/api/getDataLabolatorium.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT code, nama_pemeriksaan AS nama FROM master_data_laboratorium');
    return res.status(200).json(rows);
  } catch (err) {
    console.error('🔥 SQL Error (getDataLabolatorium):', err);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data laboratorium', error: err?.message ?? String(err) });
  }
}
