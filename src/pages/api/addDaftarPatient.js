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


  if (req.method !== 'POST') return res.status(405).json({ message: 'Method tidak diizinkan' });

  // const {
  //   noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin,
  //   namaIbu, agama, statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa,
  //   kewarganegaraan, alamat, kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw,
  //   kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan
  // } = req.body;

  const {
      no_rm,
      nama_lengkap,
      nik,
      nomor_identitas_lain,
      jenis_identitas_lain,
      tempat_lahir,
      tanggal_lahir,
      jenisKelamin,
      nama_ibu_kandung,
      agama,
      statusPernikahan,
      pendidikan,
      pekerjaan,
      golonganDarah,
      suku,
      bahasa,
      kewarganegaraan,
      alamat,
      kelurahan_desa,
      kecamatan,
      kota_kabupaten,
      provinsi,
      rt,
      rw,
      kodePos,
      no_telepon_pribadi,
      no_telepon_rumah,
      jenis_penjamin,
      no_penjamin,
      tandaTangan,
      tanggal_persetujuan,
    } = req.body;

  try {
    const pool = getPool();

    // format tanggal (ambil bagian date jika ISO)
    const tanggalLahirFmt = tanggalLahir ? String(tanggalLahir).split('T')[0] : null;

    // const sql = `
    //   INSERT INTO daftarpatients (
    //     noRM, namaLengkap, namaKeluarga, nik, tempatLahir, tanggalLahir, jenisKelamin,
    //     namaIbu, agama, statusPernikahan, pendidikan, pekerjaan, golonganDarah, suku, bahasa,
    //     kewarganegaraan, alamat, kelurahanDesa, kecamatan, kotaKabupaten, provinsi, rt, rw,
    //     kodePos, nomorTelepon, nomorTeleponRumah, tandaTangan
    //   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    // `;

    // const values = [
    //   noRM || null,
    //   namaLengkap || null,
    //   namaKeluarga || null,
    //   nik || null,
    //   tempatLahir || null,
    //   tanggalLahirFmt,
    //   jenisKelamin || null,
    //   namaIbu || null,
    //   agama || null,
    //   statusPernikahan || null,
    //   pendidikan || null,
    //   pekerjaan || null,
    //   golonganDarah || null,
    //   suku || null,
    //   bahasa || null,
    //   kewarganegaraan || null,
    //   alamat || null,
    //   kelurahanDesa || null,
    //   kecamatan || null,
    //   kotaKabupaten || null,
    //   provinsi || null,
    //   rt || null,
    //   rw || null,
    //   kodePos || null,
    //   nomorTelepon || null,
    //   nomorTeleponRumah || null,
    //   tandaTangan || null,
    // ];

    const sql = `
      INSERT INTO daftarpatients (
        no_rm,
        nama_lengkap,
        nik,
        nomor_identitas_lain,
        jenis_identitas_lain,
        tempat_lahir,
        tanggal_lahir,
        jenisKelamin,
        nama_ibu_kandung,
        agama,
        statusPernikahan,
        pendidikan,
        pekerjaan,
        golonganDarah,
        suku,
        bahasa,
        kewarganegaraan,
        alamat,
        kelurahan_desa,
        kecamatan,
        kota_kabupaten,
        provinsi,
        rt,
        rw,
        kodePos,
        no_telepon_pribadi,
        no_telepon_rumah,
        jenis_penjamin,
        no_penjamin,
        tandaTangan,
        tanggal_persetujuan
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// const values = [
//   no_rm,
//   nama_lengkap,
//   nik || null,
//   nomor_identitas_lain || null,
//   jenis_identitas_lain || null,
//   tempat_lahir || null,
//   tanggal_lahir || null,
//   jenisKelamin,
//   nama_ibu_kandung || null,
//   agama || null,
//   statusPernikahan || null,
//   pendidikan || null,
//   pekerjaan || null,
//   golonganDarah || null,
//   suku || null,
//   bahasa || null,
//   kewarganegaraan || null,
//   alamat || null,
//   kelurahan_desa || null,
//   kecamatan || null,
//   kota_kabupaten || null,
//   provinsi || null,
//   rt || null,
//   rw || null,
//   kodePos || null,
//   no_telepon_pribadi || null,
//   no_telepon_rumah || null,
//   jenis_penjamin || null,
//   no_penjamin || null,
//   tandaTangan || null,
//   tanggal_persetujuan || currentDate, // fallback sekarang jika null
// ];

const values = [
  no_rm,
  nama_lengkap,
  nik || null,
  nomor_identitas_lain || null,
  jenis_identitas_lain || null,
  tempat_lahir || null,
  tanggal_lahir ? tanggal_lahir.split('T')[0] : null,
  jenisKelamin || 'Tidak diketahui',
  nama_ibu_kandung || null,
  agama || 'Lainnya',
  statusPernikahan || 'Belum Kawin',
  pendidikan || 'Tidak sekolah',
  pekerjaan || null,
  golonganDarah || 'O',
  suku || null,
  bahasa || 'Indonesia',
  kewarganegaraan || 'WNI',
  alamat || null,
  kelurahan_desa || null,
  kecamatan || null,
  kota_kabupaten || null,
  provinsi || null,
  rt || null,
  rw || null,
  kodePos || null,
  no_telepon_pribadi || null,
  no_telepon_rumah || null,
  jenis_penjamin || 'Umum',
  no_penjamin || null,
  tandaTangan || null,
  tanggal_persetujuan ? tanggal_persetujuan.split('T')[0] : currentDate,
];


    // const values = [
    //   no_rm,
    //   nama_lengkap,
    //   nik || null,
    //   nomor_identitas_lain || null,
    //   jenis_identitas_lain || null,
    //   tempat_lahir || null,
    //   tanggal_lahir || null,
    //   jenisKelamin,
    //   nama_ibu_kandung || null,
    //   agama || null,
    //   statusPernikahan || null,
    //   pendidikan || null,
    //   pekerjaan || null,
    //   golonganDarah || null,
    //   suku || null,
    //   bahasa || null,
    //   kewarganegaraan || null,
    //   alamat || null,
    //   kelurahan_desa || null,
    //   kecamatan || null,
    //   kota_kabupaten || null,
    //   provinsi || null,
    //   rt || null,
    //   rw || null,
    //   kodePos || null,
    //   no_telepon_pribadi || null,
    //   no_telepon_rumah || null,
    //   jenis_penjamin || null,
    //   no_penjamin || null,
    //   tandaTangan || null,
    //   tanggal_persetujuan || null,
    // ];

    await pool.query(sql, values);

    return res.status(200).json({ message: 'Pendaftaran pasien berhasil' });
  } catch (error) {
    console.error('🔥 SQL Error (addDaftarPatient):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}
