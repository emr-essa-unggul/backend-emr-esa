// import mysql from 'mysql2/promise';
// //code src/pages/api/addPemeriksaanHeadToToe.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const {
//       noAntrian,
//       kepala,
//       mata,
//       telinga,
//       hidung,
//       leher,
//       dada,
//       perut,
//       punggung,
//       lengan,
//       tungkai,
//       kukuTangan,
//       persendianTangan,
//       tungkaiAtas,
//       tungkaiBawah,
//       jariKaki,
//       kukuKaki,
//       persendianKaki
//     } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         `INSERT INTO pemeriksaan_head_to_toe 
//          (noAntrian, kepala, mata, telinga, hidung, leher, dada, perut, punggung, lengan, tungkai, kuku_tangan, persendian_tangan, tungkai_atas, tungkai_bawah, jari_kaki, kuku_kaki, persendian_kaki) 
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           noAntrian,
//           kepala,
//           mata,
//           telinga,
//           hidung,
//           leher,
//           dada,
//           perut,
//           punggung,
//           lengan,
//           tungkai,
//           kukuTangan,
//           persendianTangan,
//           tungkaiAtas,
//           tungkaiBawah,
//           jariKaki,
//           kukuKaki,
//           persendianKaki,
//         ]
//       );

//       res.status(200).json({ message: 'Pemeriksaan Head to Toe berhasil disimpan' });
//     } catch (error) {
//       res.status(500).json({ message: 'Gagal menyimpan data pemeriksaan', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/addPemeriksaanHeadToToe.js
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


  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const {
    noAntrian,
    kepala,
    mata,
    telinga,
    hidung,
    leher,
    dada,
    perut,
    punggung,
    lengan,
    tungkai,
    kukuTangan,
    persendianTangan,
    tungkaiAtas,
    tungkaiBawah,
    jariKaki,
    kukuKaki,
    persendianKaki
  } = req.body;

  if (!noAntrian) return res.status(400).json({ message: 'noAntrian wajib diisi' });

  try {
    const pool = getPool();

    const sql = `
      INSERT INTO pemeriksaan_head_to_toe (
        noAntrian, kepala, mata, telinga, hidung, leher, dada, perut, punggung, lengan, tungkai,
        kuku_tangan, persendian_tangan, tungkai_atas, tungkai_bawah, jari_kaki, kuku_kaki, persendian_kaki
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      noAntrian,
      kepala || null,
      mata || null,
      telinga || null,
      hidung || null,
      leher || null,
      dada || null,
      perut || null,
      punggung || null,
      lengan || null,
      tungkai || null,
      kukuTangan || null,
      persendianTangan || null,
      tungkaiAtas || null,
      tungkaiBawah || null,
      jariKaki || null,
      kukuKaki || null,
      persendianKaki || null,
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Pemeriksaan Head to Toe berhasil disimpan' });
  } catch (error) {
    console.error('🔥 SQL Error (addPemeriksaanHeadToToe):', error);
    return res.status(500).json({ message: 'Gagal menyimpan data pemeriksaan', error: error?.message ?? String(error) });
  }
}
