// import mysql from 'mysql2/promise';
// //code src/pages/api/addPatient.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noRM, nama, poli, dokter, tanggalKunjungan } = req.body;

//     if (!noRM || !nama || !poli || !dokter || !tanggalKunjungan) {
//       return res.status(400).json({ message: 'Harap isi semua field' });
//     }

//     try {
//         const connection = await mysql.createConnection({
//           host: 'localhost',
//           user: 'root',
//           password: 'Bekasibarat12',
//           database: 'emr_db',
//         });
      
//         await connection.query(
//           'INSERT INTO patients (noRM, nama, poli, dokter, tanggalKunjungan) VALUES (?, ?, ?, ?, ?)',
//           [noRM, nama, poli, dokter, tanggalKunjungan]
//         );
      
//         await connection.end();
//         res.status(200).json({ message: 'Pasien berhasil didaftarkan' });
//       } catch (error) {
//         console.error('Error inserting patient:', error); // Tambahkan ini untuk melihat pesan error
//         res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//       }
      
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/addPatient.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { noRM, nama, poli, dokter, tanggalKunjungan } = req.body;

  if (!noRM || !nama || !poli || !dokter || !tanggalKunjungan) {
    return res.status(400).json({ message: 'Harap isi semua field' });
  }

  try {
    const pool = getPool();

    // format tanggal (jika ISO)
    const tanggalFmt = String(tanggalKunjungan).split('T')[0];

    await pool.query(
      'INSERT INTO patients (noRM, nama, poli, dokter, tanggalKunjungan) VALUES (?, ?, ?, ?, ?)',
      [noRM, nama, poli, dokter, tanggalFmt]
    );

    return res.status(200).json({ message: 'Pasien berhasil didaftarkan' });
  } catch (error) {
    console.error('🔥 SQL Error (addPatient):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
