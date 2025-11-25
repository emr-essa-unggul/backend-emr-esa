// import mysql from 'mysql2/promise';
// //code src/pages/api/addAssessmentAwal.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { noAntrian, denyutJantung, pernapasan, suhu, tekananDarahSistol, tekananDarahDiastol, beratBadan, tinggiBadan, keluhanUtama, riwayatPenyakit, riwayatAlergi, riwayatPengobatan } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       await connection.query(
//         `INSERT INTO assessment_awal (noAntrian, denyut_jantung, pernapasan, suhu, tekanan_darah_sistol, tekanan_darah_diastol, berat_badan, tinggi_badan, keluhan_utama, riwayat_penyakit, riwayat_alergi, riwayat_pengobatan)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [noAntrian, denyutJantung, pernapasan, suhu, tekananDarahSistol, tekananDarahDiastol, beratBadan, tinggiBadan, keluhanUtama, riwayatPenyakit, riwayatAlergi, riwayatPengobatan]
//       );

//       res.status(200).json({ message: 'Data assessment awal berhasil disimpan' });
//     } catch (error) {
//       res.status(500).json({ message: 'Gagal menyimpan assessment awal', error: error.message });
//     }
//   }
// }




// src/pages/api/addAssessmentAwal.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  const {
    noAntrian,
    denyutJantung,
    pernapasan,
    suhu,
    tekananDarahSistol,
    tekananDarahDiastol,
    beratBadan,
    tinggiBadan,
    keluhanUtama,
    riwayatPenyakit,
    riwayatAlergi,
    riwayatPengobatan,
  } = req.body;

  try {
    const pool = getPool();

    const sql = `
      INSERT INTO assessment_awal (
        noAntrian, denyut_jantung, pernapasan, suhu, tekanan_darah_sistol, tekanan_darah_diastol,
        berat_badan, tinggi_badan, keluhan_utama, riwayat_penyakit, riwayat_alergi, riwayat_pengobatan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      noAntrian || null,
      denyutJantung || null,
      pernapasan || null,
      suhu || null,
      tekananDarahSistol || null,
      tekananDarahDiastol || null,
      beratBadan || null,
      tinggiBadan || null,
      keluhanUtama || null,
      riwayatPenyakit || null,
      riwayatAlergi || null,
      riwayatPengobatan || null,
    ]);

    return res.status(200).json({ message: 'Data assessment awal berhasil disimpan' });
  } catch (error) {
    console.error('🔥 SQL Error (addAssessmentAwal):', error);
    return res.status(500).json({ message: 'Gagal menyimpan assessment awal', error: error?.message ?? String(error) });
  }
}
