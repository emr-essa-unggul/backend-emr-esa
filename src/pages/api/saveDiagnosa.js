// // /pages/api/saveDiagnosa.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/saveDiagnosa.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noRM, diagnosa } = req.body;

//     try {
//       const conn = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       // Optional: hapus diagnosa lama untuk noRM ini dulu
//       await conn.query('DELETE FROM diagnosa WHERE noRM = ?', [noRM]);

//       // Masukkan diagnosa baru
//       for (const d of diagnosa) {
//         await conn.query(
//           'INSERT INTO diagnosa (noRM, kode_icd_10, nama_diagnosa, versi) VALUES (?, ?, ?, ?)',
//           [noRM, d.kode_icd_10, d.nama_diagnosa, d.versi]
//         );
//       }

//       await conn.end();
//       res.status(200).json({ message: 'Diagnosa disimpan.' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Gagal simpan diagnosa' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }


// src/pages/api/saveDiagnosa.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { noRM, diagnosa } = req.body;
  if (!noRM || !Array.isArray(diagnosa)) return res.status(400).json({ error: 'Payload tidak valid' });

  try {
    const pool = getPool();

    // gunakan transaction agar konsisten
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM diagnosa WHERE noRM = ?', [noRM]);

      const insertPromises = diagnosa.map(d =>
        conn.query('INSERT INTO diagnosa (noRM, kode_icd_10, nama_diagnosa, versi) VALUES (?, ?, ?, ?)', [noRM, d.kode_icd_10, d.nama_diagnosa, d.versi])
      );
      await Promise.all(insertPromises);

      await conn.commit();
      conn.release();
      return res.status(200).json({ message: 'Diagnosa disimpan.' });
    } catch (e) {
      await conn.rollback();
      conn.release();
      throw e;
    }
  } catch (err) {
    console.error('🔥 SQL Error (saveDiagnosa):', err);
    return res.status(500).json({ error: 'Gagal simpan diagnosa' });
  }
}
