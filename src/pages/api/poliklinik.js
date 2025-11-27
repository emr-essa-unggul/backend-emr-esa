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
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
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
