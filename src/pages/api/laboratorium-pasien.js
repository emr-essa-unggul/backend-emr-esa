// // pages/api/laboratorium-pasien.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/laboratorium-pasien.js

// export default async function handler(req, res) {
//   const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'Bekasibarat12',
//     database: 'emr_db',
//   };

//   try {
//     const conn = await mysql.createConnection(dbConfig);

//     // ✅ GET data laboratorium berdasarkan noRM
//     if (req.method === 'GET' && req.query.noRM) {
//       const [rows] = await conn.query(
//         'SELECT kode_lab AS kode, nama_lab AS nama FROM laboratorium_pasien WHERE noRM = ?',
//         [req.query.noRM]
//       );
//       await conn.end();
//       return res.status(200).json(rows);
//     }

//     await conn.end();
//     return res.status(400).json({ message: 'noRM tidak diberikan' });
//   } catch (error) {
//     console.error('❌ API Error - laboratorium-pasien:', error);
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }




// src/pages/api/laboratorium-pasien.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();

    // GET data laboratorium per pasien (by noRM)
    if (req.method === 'GET' && req.query.noRM) {
      const [rows] = await pool.query('SELECT kode_lab AS kode, nama_lab AS nama FROM laboratorium_pasien WHERE noRM = ?', [req.query.noRM]);
      return res.status(200).json(rows);
    }

    return res.status(400).json({ message: 'noRM tidak diberikan' });
  } catch (error) {
    console.error('🔥 SQL Error (laboratorium-pasien):', error);
    return res.status(500).json({ message: 'Server error', error: error?.message ?? String(error) });
  }
}
