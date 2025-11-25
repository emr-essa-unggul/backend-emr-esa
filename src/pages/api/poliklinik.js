// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     // Ambil nama_poliklinik yang tidak null dan tidak duplikat
//     const [rows] = await connection.query('SELECT DISTINCT nama_poliklinik FROM poliklinik WHERE nama_poliklinik IS NOT NULL');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching poliklinik:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//   }
// }



// pages/api/poliklinik.js (atau endpoint mana pun yang kamu gunakan)

// pages/api/poliklinik.js


//ini jangan dihapus ya kii ini main nya kepalanya
// import mysql from 'mysql2/promise';
// //code src/pages/api/poliklinik.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     // Join data poliklinik dan master dokter
//     const [rows] = await connection.query(`
//       SELECT 
//         p.id_poli,
//         p.id_dokter,
//         d.nama_dokter,
//         d.spesialisasi AS nama_poliklinik
//       FROM poliklinik p
//       JOIN master_data_dokter d ON p.id_dokter = d.id_dokter
//     `);

//     await connection.end();
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching poliklinik with join:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//   }
// }


// src/pages/api/poliklinik.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        p.id_poli,
        p.id_dokter,
        d.nama_dokter,
        d.spesialisasi AS nama_poliklinik
      FROM poliklinik p
      JOIN master_data_dokter d ON p.id_dokter = d.id_dokter
    `);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (poliklinik):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan di server', error: error?.message ?? String(error) });
  }
}
