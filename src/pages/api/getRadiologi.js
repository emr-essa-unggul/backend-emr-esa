// // /pages/api/getRadiologi.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/getRadiologi.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query(`
//       SELECT 
//         id_loincrad,
//         kategori,
//         kode_lokal AS kode,
//         nama_pemeriksaan AS nama,
//         permintaan_hasil,
//         metode_analisis,
//         code,
//         display,
//         code_system,
//         harga_umum,
//         harga_bpjs
//       FROM master_data_radiologi
//       ORDER BY nama_pemeriksaan ASC
//     `);

//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('❌ Error fetching radiologi data:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data radiologi', error: error.message });
//   }
// }




// src/pages/api/getRadiologi.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const [rows] = await pool.query(`
      SELECT 
        id_loincrad,
        kategori,
        kode_lokal AS kode,
        nama_pemeriksaan AS nama,
        permintaan_hasil,
        metode_analisis,
        code,
        display,
        code_system,
        harga_umum,
        harga_bpjs
      FROM master_data_radiologi
      ORDER BY nama_pemeriksaan ASC
    `);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('🔥 SQL Error (getRadiologi):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data radiologi', error: error?.message ?? String(error) });
  }
}
