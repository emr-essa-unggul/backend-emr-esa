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
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://emr-ueu.web.app',
  'https://emr-ueu.firebaseapp.com', // jika perlu
  // tambahkan origin lain yang harus diizinkan
];

export default async function handler(req, res) {

  const origin = req.headers.origin;

  // Set CORS headers if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    // Jika front-end butuh mengirim cookie/session, aktifkan credentials dan pastikan origin bukan '*'
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    // Permintaan server-to-server (curl, internal) mungkin tidak punya origin -> izinkan
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // Origin tidak diizinkan -> jangan set Access-Control-Allow-Origin atau kembalikan 403 untuk OPTIONS/GET/POST khususnya
    // Kita tetap lanjutkan supaya response memiliki no-cors di browser (browser akan block client-side).
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
