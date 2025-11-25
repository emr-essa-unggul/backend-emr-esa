// import mysql from 'mysql2/promise';
// //code src/pages/api/updateStatusAntrian.js
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { id, status } = req.body;

//     if (!id || !status) {
//       return res.status(400).json({ message: 'ID dan status wajib diisi.' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       // Update status pada antrian berdasarkan ID
//       const [result] = await connection.query(
//         'UPDATE antrian_pemeriksaan SET status = ? WHERE id = ?',
//         [status, id]
//       );

//       await connection.end();

//       if (result.affectedRows > 0) {
//         res.status(200).json({ message: 'Status berhasil diperbarui.' });
//       } else {
//         res.status(400).json({ message: 'Tidak dapat menemukan data antrian yang sesuai.' });
//       }
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/updateStatusAntrian.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ message: 'ID dan status wajib diisi.' });

  try {
    const pool = getPool();
    const [result] = await pool.query('UPDATE antrian_pemeriksaan SET status = ? WHERE id = ?', [status, id]);

    if (result && result.affectedRows > 0) {
      return res.status(200).json({ message: 'Status berhasil diperbarui.' });
    } else {
      return res.status(404).json({ message: 'Tidak dapat menemukan data antrian yang sesuai.' });
    }
  } catch (error) {
    console.error('🔥 SQL Error (updateStatusAntrian):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error?.message ?? String(error) });
  }
}
