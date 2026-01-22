// import mysql from 'mysql2/promise';
// //code src/pages/api/getDaftarPatient.js

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db'
//     });

//     const [rows] = await connection.query('SELECT * FROM daftarpatients ORDER BY createdAt DESC');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     res.status(500).json({ message: 'Gagal mengambil data pasien', error: error.message });
//   }
// }




// // src/pages/api/getDaftarPatient.js
// import { getPool } from '@/lib/db';
// const ALLOWED_ORIGINS = [
//   'http://localhost:3000',
//   'http://127.0.0.1:3000',
//   'https://emr-ueu.web.app',
//   'https://emr-ueu.firebaseapp.com', // jika perlu
//   // tambahkan origin lain yang harus diizinkan
// ];

// export default async function handler(req, res) {
//   const origin = req.headers.origin;

//   // Set CORS headers if origin is allowed
//   if (origin && ALLOWED_ORIGINS.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
//     // Jika front-end butuh mengirim cookie/session, aktifkan credentials dan pastikan origin bukan '*'
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//   } else if (!origin) {
//     // Permintaan server-to-server (curl, internal) mungkin tidak punya origin -> izinkan
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   } else {
//     // Origin tidak diizinkan -> jangan set Access-Control-Allow-Origin atau kembalikan 403 untuk OPTIONS/GET/POST khususnya
//     // Kita tetap lanjutkan supaya response memiliki no-cors di browser (browser akan block client-side).
//   }

//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//   // Handle preflight request
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }

//   if (req.method !== 'GET') return res.status(405).json({ message: 'Method tidak diizinkan' });

//   try {
//     const pool = getPool();

//     const [rows] = await pool.query('SELECT * FROM daftarpatients ORDER BY createdAt DESC');

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error('🔥 SQL Error (getDaftarPatient):', error);
//     return res.status(500).json({ message: 'Gagal mengambil data pasien', error: error?.message ?? String(error) });
//   }
// }





// src/pages/api/getDaftarPatient.js
import { getPool } from '@/lib/db';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://emr-ueu.web.app',
  'https://emr-ueu.firebaseapp.com',
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method tidak diizinkan' });
  }

  try {
    const pool = getPool();
    
    // PERBAIKAN: Gunakan created_at (sesuai struktur database)
    const [rows] = await pool.query('SELECT * FROM daftarpatients ORDER BY created_at DESC');
    
    console.log('✅ Successfully fetched patients:', rows.length);
    
    // Map database fields to frontend-friendly format
    const mappedRows = rows.map(row => ({
      ...row,
      noRM: row.no_rm,
      namaLengkap: row.nama_lengkap,
      tempatLahir: row.tempat_lahir,
      tanggalLahir: row.tanggal_lahir,
      namaIbu: row.nama_ibu_kandung,
      kelurahanDesa: row.kelurahan_desa,
      kotaKabupaten: row.kota_kabupaten,
      nomorTelepon: row.no_telepon_pribadi,
      nomorTeleponRumah: row.no_telepon_rumah,
      createdAt: row.created_at,
      nomorIdentitasLain: row.nomor_identitas_lain,
      jenisIdentitasLain: row.jenis_identitas_lain,
      jenisPenjamin: row.jenis_penjamin,
      noPenjamin: row.no_penjamin,
      tanggalPersetujuan: row.tanggal_persetujuan,
    }));
    
    return res.status(200).json(mappedRows);
  } catch (error) {
    console.error('🔥 SQL Error (getDaftarPatient):', error);
    console.error('🔥 Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Gagal mengambil data pasien', 
      error: error?.message ?? String(error),
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}