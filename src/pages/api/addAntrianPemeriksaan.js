// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const {
//       tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//       poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
//     } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       // Cari nomor antrian terakhir
//       const [rows] = await connection.query('SELECT noAntrian FROM antrian_pemeriksaan ORDER BY id DESC LIMIT 1');
//       let nextNoAntrian = 'A001';  // Default noAntrian jika tabel kosong

//       if (rows.length > 0) {
//         // Ambil nomor terakhir, tambahkan 1
//         const lastNoAntrian = rows[0].noAntrian;
//         const numericPart = parseInt(lastNoAntrian.substring(1)) + 1;
//         nextNoAntrian = `A${numericPart.toString().padStart(3, '0')}`;  // Format ke A001, A002, dst.
//       }

//       await connection.query(
//         `INSERT INTO antrian_pemeriksaan (
//           noAntrian, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//           poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [nextNoAntrian, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//           poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Antrian berhasil disimpan', noAntrian: nextNoAntrian });
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan dalam menyimpan data antrian', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



//update tgl 8 februari 2025
// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const {
//       noRM, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//       poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
//     } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       // Cari nomor antrian terakhir
//       const [rows] = await connection.query('SELECT noAntrian FROM antrian_pemeriksaan ORDER BY id DESC LIMIT 1');
//       let nextNoAntrian = 'A001';  // Default noAntrian jika tabel kosong

//       if (rows.length > 0) {
//         // Ambil nomor terakhir, tambahkan 1
//         const lastNoAntrian = rows[0].noAntrian;
//         const numericPart = parseInt(lastNoAntrian.substring(1)) + 1;
//         nextNoAntrian = `A${numericPart.toString().padStart(3, '0')}`;  // Format ke A001, A002, dst.
//       }

//       await connection.query(
//         `INSERT INTO antrian_pemeriksaan (
//           noAntrian, noRM, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//           poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [nextNoAntrian, noRM, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//           poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Antrian berhasil disimpan', noAntrian: nextNoAntrian });
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan dalam menyimpan data antrian', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



//jangan dihapus kii ini main atau kepalanya
// import mysql from 'mysql2/promise';
// //code src/pages/api/addAntrianPemeriksaan.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const {
//       noRM, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//       poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
//     } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       // Cari nomor antrian terakhir
//       const [rows] = await connection.query('SELECT noAntrian FROM antrian_pemeriksaan ORDER BY id DESC LIMIT 1');
//       let nextNoAntrian = 'A001';  // Default noAntrian jika tabel kosong

//       if (rows.length > 0) {
//         // Ambil nomor terakhir, tambahkan 1
//         const lastNoAntrian = rows[0].noAntrian;
//         const numericPart = parseInt(lastNoAntrian.substring(1)) + 1;
//         nextNoAntrian = `A${numericPart.toString().padStart(3, '0')}`;  // Format ke A001, A002, dst.
//       }

//       // Ganti nilai kosong dengan NULL
//       const values = [
//         nextNoAntrian,
//         noRM,
//         tanggal || null,
//         namaPenanggungJawab || null,
//         noTeleponPenanggungJawab || null,
//         hubunganDenganPasien || null,
//         poliklinikTujuan || null,
//         dokter || null,
//         caraMasuk || null,
//         pembayaran || null,
//         noAsuransi || null,
//       ];

//       await connection.query(
//         `INSERT INTO antrian_pemeriksaan (
//           noAntrian, noRM, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
//           poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         values
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Antrian berhasil disimpan', noAntrian: nextNoAntrian });
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan dalam menyimpan data antrian', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/addAntrianPemeriksaan.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const {
    noRM,
    tanggal,
    namaPenanggungJawab,
    noTeleponPenanggungJawab,
    hubunganDenganPasien,
    poliklinikTujuan,
    dokter,
    caraMasuk,
    pembayaran,
    noAsuransi,
  } = req.body;

  try {
    const pool = getPool();

    // Ambil noAntrian terakhir
    const [rows] = await pool.query(
      'SELECT noAntrian FROM antrian_pemeriksaan ORDER BY id DESC LIMIT 1'
    );

    let nextNoAntrian = 'A001';
    if (rows && rows.length > 0 && rows[0].noAntrian) {
      const lastNoAntrian = rows[0].noAntrian;
      const numericPart = parseInt(lastNoAntrian.substring(1), 10) + 1;
      nextNoAntrian = `A${numericPart.toString().padStart(3, '0')}`;
    }

    const tanggalFmt = tanggal ? tanggal.split('T')[0] : null;

    const sql = `
      INSERT INTO antrian_pemeriksaan (
        noAntrian, noRM, tanggal, namaPenanggungJawab, noTeleponPenanggungJawab, hubunganDenganPasien,
        poliklinikTujuan, dokter, caraMasuk, pembayaran, noAsuransi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nextNoAntrian,
      noRM || null,
      tanggalFmt,
      namaPenanggungJawab || null,
      noTeleponPenanggungJawab || null,
      hubunganDenganPasien || null,
      poliklinikTujuan || null,
      dokter || null,
      caraMasuk || null,
      pembayaran || null,
      noAsuransi || null,
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Antrian berhasil disimpan', noAntrian: nextNoAntrian });
  } catch (error) {
    console.error('🔥 SQL Error (addAntrianPemeriksaan):', error);
    return res.status(500).json({
      message: 'Terjadi kesalahan dalam menyimpan data antrian',
      error: error?.message ?? String(error),
    });
  }
}
