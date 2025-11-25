// import mysql from 'mysql2/promise';
// //code src/pages/api/addStaff.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { kodeStaff, namaStaff, jenisKelamin, nik, noTelepon, alamat, posisi, unit, noSTR, username, kataSandi } = req.body;

//     if (!kodeStaff || !namaStaff || !jenisKelamin || !username || !kataSandi) {
//       return res.status(400).json({ message: 'Harap isi field yang wajib' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         'INSERT INTO staff (kodeStaff, namaStaff, jenisKelamin, nik, noTelepon, alamat, posisi, unit, noSTR, username, kataSandi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//         [kodeStaff, namaStaff, jenisKelamin, nik, noTelepon, alamat, posisi, unit, noSTR, username, kataSandi]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Staff berhasil ditambahkan' });
//     } catch (error) {
//       console.error('Error inserting staff:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/addStaff.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { kodeStaff, namaStaff, jenisKelamin, nik, noTelepon, alamat, posisi, unit, noSTR, username, kataSandi } = req.body;

  if (!kodeStaff || !namaStaff || !jenisKelamin || !username || !kataSandi) {
    return res.status(400).json({ message: 'Harap isi field yang wajib' });
  }

  try {
    const pool = getPool();

    // NOTE: jangan simpan kataSandi plain-text di production -> gunakan bcrypt
    const sql = `
      INSERT INTO staff (
        kodeStaff, namaStaff, jenisKelamin, nik, noTelepon, alamat, posisi, unit, noSTR, username, kataSandi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      kodeStaff,
      namaStaff,
      jenisKelamin,
      nik || null,
      noTelepon || null,
      alamat || null,
      posisi || null,
      unit || null,
      noSTR || null,
      username,
      kataSandi, // sebaiknya hash dulu
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Staff berhasil ditambahkan' });
  } catch (error) {
    console.error('🔥 SQL Error (addStaff):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
