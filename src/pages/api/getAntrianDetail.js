// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { noRM } = req.query;  // Ambil noRM dari parameter query

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       // Query join antara antrian_pemeriksaan dan daftarpatients berdasarkan noRM
//       const [rows] = await connection.query(`
//         SELECT a.noRM, a.tanggal, p.nik, p.jenisKelamin, p.namaLengkap, p.tempatLahir, p.tanggalLahir
//         FROM antrian_pemeriksaan a
//         JOIN daftarpatients p ON a.noRM = p.noRM
//         WHERE a.noRM = ?
//       `, [noRM]);

//       await connection.end();

//       if (rows.length > 0) {
//         res.status(200).json(rows[0]);  // Kirim data pertama
//       } else {
//         res.status(404).json({ message: 'Data tidak ditemukan' });
//       }
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }


// ini jangan dihapus ya kii ini main nya kepalanya
// import mysql from 'mysql2/promise';
// //code src/pages/api/getAntrianDetail.js

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     const { noRM } = req.query;  // Ambil noRM dari parameter query

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       console.log('Mencari data dengan noRM:', noRM);

//       // Query join antara antrian_pemeriksaan dan daftarpatients berdasarkan noRM
//       const [rows] = await connection.query(`
//         SELECT a.noRM, a.tanggal, p.nik, p.jenisKelamin, p.namaLengkap, p.tempatLahir, p.tanggalLahir
//         FROM antrian_pemeriksaan a
//         JOIN daftarpatients p ON a.noRM = p.noRM
//         WHERE a.noRM = ?
//       `, [noRM]);

//       console.log('Hasil query:', rows);

//       await connection.end();

//       if (rows.length > 0) {
//         res.status(200).json(rows[0]);  // Kirim data pertama
//       } else {
//         res.status(404).json({ message: 'Data tidak ditemukan' });
//       }
//     } catch (error) {
//       console.error('Database Error:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/getAntrianDetail.js
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

  if (req.method !== 'GET') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { noRM } = req.query;
  if (!noRM) return res.status(400).json({ message: 'noRM wajib disertakan sebagai query parameter' });

  try {
    const pool = getPool();

    console.log('Mencari data dengan noRM:', noRM);

    const [rows] = await pool.query(
      `
      SELECT a.noRM, a.tanggal, p.nik, p.jenisKelamin, p.namaLengkap, p.tempatLahir, p.tanggalLahir
      FROM antrian_pemeriksaan a
      JOIN daftarpatients p ON a.noRM = p.noRM
      WHERE a.noRM = ?
      LIMIT 1
      `,
      [noRM]
    );

    console.log('Hasil query:', rows);

    if (rows && rows.length > 0) {
      return res.status(200).json(rows[0]);
    } else {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
  } catch (error) {
    console.error('🔥 SQL Error (getAntrianDetail):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data', error: error?.message ?? String(error) });
  }
}
