// // pages/api/isiPemeriksaan.js
// import mysql from 'mysql2/promise';
// //code src/pages/api/addIsiPemeriksaan.js

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { noRM, noAntrian, subjective, objective, assessment, plan, diagnosa, tindakan, resepObat, edukasi } = req.body;

//   try {
//     const conn = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     await conn.query(
//       `INSERT INTO isiPemeriksaan (noRM, noAntrian, subjective, objective, assessment, plan, diagnosa, tindakan, resepObat, edukasi)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         noRM,
//         noAntrian,
//         subjective,
//         objective,
//         assessment,
//         plan,
//         JSON.stringify(diagnosa),
//         JSON.stringify(tindakan),
//         JSON.stringify(resepObat),
//         JSON.stringify(edukasi),
//       ]
//     );

//     await conn.end();
//     return res.status(200).json({ message: 'Data berhasil disimpan ke isiPemeriksaan' });
//   } catch (err) {
//     console.error('DB Error:', err);
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// }



// src/pages/api/addIsiPemeriksaan.js
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


  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { noRM, noAntrian, subjective, objective, assessment, plan, diagnosa, tindakan, resepObat, edukasi } = req.body;

  try {
    const pool = getPool();

    const sql = `
      INSERT INTO isiPemeriksaan (
        noRM, noAntrian, subjective, objective, assessment, plan, diagnosa, tindakan, resepObat, edukasi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // simpan diagnosa/tindakan/resep/edukasi sebagai JSON string (jika merupakan array/object)
    const values = [
      noRM || null,
      noAntrian || null,
      subjective || null,
      objective || null,
      assessment || null,
      plan || null,
      diagnosa ? JSON.stringify(diagnosa) : null,
      tindakan ? JSON.stringify(tindakan) : null,
      resepObat ? JSON.stringify(resepObat) : null,
      edukasi ? JSON.stringify(edukasi) : null,
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Data berhasil disimpan ke isiPemeriksaan' });
  } catch (err) {
    console.error('🔥 SQL Error (addIsiPemeriksaan):', err);
    return res.status(500).json({ message: 'Server error', error: err?.message ?? String(err) });
  }
}
