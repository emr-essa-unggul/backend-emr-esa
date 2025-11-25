// import mysql from 'mysql2/promise';
// //code src/pages/api/addObat.js
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS } = req.body;

//     if (!kodeObat || !namaObat || !namaSupplier || !noBatch || !sediaanObat || !stokObat || !hargaBeli || !hargaJualUmum || !hargaJualBPJS) {
//       return res.status(400).json({ message: 'Harap isi semua field' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         'INSERT INTO obat (kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//         [kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Obat berhasil ditambahkan' });
//     } catch (error) {
//       console.error('Error inserting obat:', error);
//       res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }



// src/pages/api/addObat.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const { kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS } = req.body;

  if (!kodeObat || !namaObat || !namaSupplier || !noBatch || !sediaanObat || (stokObat === undefined) || !hargaBeli || !hargaJualUmum || !hargaJualBPJS) {
    return res.status(400).json({ message: 'Harap isi semua field' });
  }

  try {
    const pool = getPool();

    const tanggalLahirFmt = tanggalLahir ? String(tanggalLahir).split('T')[0] : null;

    const sql = `
      INSERT INTO obat (
        kodeObat, namaObat, namaSupplier, noBatch, sediaanObat, stokObat, tanggalLahir, hargaBeli, hargaJualUmum, hargaJualBPJS
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      kodeObat,
      namaObat,
      namaSupplier,
      noBatch,
      sediaanObat,
      Number(stokObat) || 0,
      tanggalLahirFmt,
      hargaBeli,
      hargaJualUmum,
      hargaJualBPJS,
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Obat berhasil ditambahkan' });
  } catch (error) {
    console.error('🔥 SQL Error (addObat):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
