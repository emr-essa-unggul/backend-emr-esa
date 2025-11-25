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

export default async function handler(req, res) {
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
