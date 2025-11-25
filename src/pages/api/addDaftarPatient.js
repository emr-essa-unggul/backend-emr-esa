// import mysql from 'mysql2/promise';
// //code src/pages/api/addDaftarPatient.js

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const {
//       noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin,
//       namaIbu, agama, statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa,
//       kewarganegaraan, alamat, kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw,
//       kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan
//     } = req.body;

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db'
//       });

//       await connection.query(
//         `INSERT INTO daftarpatients (
//           noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin,
//           namaIbu, agama, statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa,
//           kewarganegaraan, alamat, kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw,
//           kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin, namaIbu, agama,
//           statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa, kewarganegaraan, alamat,
//           kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw, kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan]
//       );

//       await connection.end();
//       res.status(200).json({ message: 'Pendaftaran pasien berhasil' });
//     } catch (error) {
//       res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }




// src/pages/api/addDaftarPatient.js
import { getPool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  const {
    noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin,
    namaIbu, agama, statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa,
    kewarganegaraan, alamat, kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw,
    kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan
  } = req.body;

  try {
    const pool = getPool();

    // format tanggal (ambil bagian date jika ISO)
    const tanggalLahirFmt = tanggalLahir ? String(tanggalLahir).split('T')[0] : null;

    const sql = `
      INSERT INTO daftarpatients (
        noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin,
        namaIbu, agama, statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa,
        kewarganegaraan, alamat, kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw,
        kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      noRM || null,
      namaLengkap || null,
      namaKeluarga || null,
      nik || null,
      tempatLahir || null,
      tanggalLahirFmt,
      jenisKelamin || null,
      namaIbu || null,
      agama || null,
      statusPernikahan || null,
      pendidikan || null,
      pekerjaan || null,
      golonganDarah || null,
      suku || null,
      bahasa || null,
      kewarganegaraan || null,
      alamat || null,
      kelurahanDesa || null,
      kecamatan || null,
      kotaKabupaten || null,
      provinsi || null,
      rt || null,
      rw || null,
      kodePos || null,
      nomorTelepon || null,
      nomorTeleponRumah || null,
      tandaTangan || null,
    ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Pendaftaran pasien berhasil' });
  } catch (error) {
    console.error('🔥 SQL Error (addDaftarPatient):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
