// import mysql from 'mysql2/promise';
// //code src/pages/api/updateStatusAssessment.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noAntrian, status } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         'UPDATE status_assessment SET status = ? WHERE noAntrian = ?',
//         [status, noAntrian]
//       );

//       res.status(200).json({ message: 'Status berhasil diperbarui' });
//     } catch (error) {
//       res.status(500).json({ message: 'Gagal memperbarui status', error: error.message });
//     }
//   }
// }




// src/pages/api/updateStatusAssessment.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { noAntrian, status } = req.body;
  if (!noAntrian || !status) return res.status(400).json({ message: 'noAntrian dan status wajib disertakan' });

  try {
    const pool = getPool();
    const [result] = await pool.query('UPDATE status_assessment SET status = ? WHERE noAntrian = ?', [status, noAntrian]);

    if (result && result.affectedRows > 0) {
      return res.status(200).json({ message: 'Status berhasil diperbarui' });
    } else {
      return res.status(404).json({ message: 'Record tidak ditemukan' });
    }
  } catch (error) {
    console.error('🔥 SQL Error (updateStatusAssessment):', error);
    return res.status(500).json({ message: 'Gagal memperbarui status', error: error?.message ?? String(error) });
  }
}
