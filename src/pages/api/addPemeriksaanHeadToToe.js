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

export default async function handler(req, res) {
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
