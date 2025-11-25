// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query('SELECT * FROM data_icd10');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching obat:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//   }
// }

//ini jangan diubah ya kii ini main atau kepalanya
// import mysql from 'mysql2/promise';
// //code src/pages/api/getDiagnosa.js
// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const dbConfig = {
//     host: 'localhost',
//     user: 'root', // Sesuaikan dengan user MySQL Anda
//     password: 'Bekasibarat12', // Sesuaikan dengan password MySQL Anda
//     database: 'emr_db',
//   };

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute('SELECT id_icd10, kode_icd_10, nama_diagnosa, versi FROM data_icd10');
//     connection.end();

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error('Database Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
//   }
// }


// src/pages/api/getDiagnosa.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT id_icd10, kode_icd_10, nama_diagnosa, versi FROM data_icd10');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getDiagnosa):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
