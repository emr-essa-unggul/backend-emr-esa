// import mysql from 'mysql2/promise';
// //code src/pages/api/getProsesAssessment.js

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { pasienId } = req.query;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       const [rows] = await connection.query(
//         `SELECT * FROM proses_assessment WHERE pasienId = ? ORDER BY id DESC LIMIT 1`,
//         [pasienId]
//       );

//       await connection.end();
//       res.status(200).json(rows[0] || null);
//     } catch (error) {
//       console.error('Fetch Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data.', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/getProsesAssessment.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { pasienId } = req.query;
  if (!pasienId) return res.status(400).json({ message: 'pasienId wajib sebagai query parameter' });

  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM proses_assessment WHERE pasienId = ? ORDER BY id DESC LIMIT 1', [pasienId]);
    return res.status(200).json(rows[0] ?? null);
  } catch (error) {
    console.error('🔥 SQL Error (getProsesAssessment):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data.', error: error?.message ?? String(error) });
  }
}
