// // pages/api/deleteLaboratoriumPasien.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/deleteLaboratoriumPasien.js

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { noRM, kode } = req.body;
//   if (!noRM || !kode) return res.status(400).json({ message: 'Invalid input' });

//   const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'Bekasibarat12', database: 'emr_db' });

//   try {
//     await conn.query('DELETE FROM laboratorium_pasien WHERE noRM = ? AND kode_lab = ?', [noRM, kode]);
//     await conn.end();
//     return res.status(200).json({ message: 'Data dihapus' });
//   } catch (err) {
//     console.error('❌ Error delete:', err);
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// }



// src/pages/api/deleteLaboratoriumPasien.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { noRM, kode } = req.body;
  if (!noRM || !kode) return res.status(400).json({ message: 'Invalid input' });

  try {
    const pool = getPool();

    const [result] = await pool.query(
      'DELETE FROM laboratorium_pasien WHERE noRM = ? AND kode_lab = ?',
      [noRM, kode]
    );

    // optionally check affectedRows
    if (result && result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    return res.status(200).json({ message: 'Data dihapus' });
  } catch (err) {
    console.error('🔥 SQL Error (deleteLaboratoriumPasien):', err);
    return res.status(500).json({ message: 'Server error', error: err?.message ?? String(err) });
  }
}
