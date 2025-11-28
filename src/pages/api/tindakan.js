//ini jangan dihapus ya kii ini main nya kepalanya
// import mysql from 'mysql2/promise';
// //code src/pages/api/tindakan.js

// export default async function handler(req, res) {
//   const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'Bekasibarat12',
//     database: 'emr_db',
//   };

//   try {
//     const conn = await mysql.createConnection(dbConfig);

//     // ✅ METHOD GET → Ambil daftar semua tindakan dari master_data_tindakan
//     if (req.method === 'GET') {
//       const [rows] = await conn.execute(
//         'SELECT id_tindakan, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs FROM master_data_tindakan'
//       );
//       await conn.end();
//       return res.status(200).json(rows);
//     }

//     // ✅ METHOD POST → Simpan tindakan yang dipilih berdasarkan pasien (noRM)
//     if (req.method === 'POST') {
//       const { noRM, tindakan } = req.body;

//       if (!noRM || !Array.isArray(tindakan)) {
//         return res.status(400).json({ message: 'Data tidak valid.' });
//       }

//       // Bersihkan data tindakan lama
//       await conn.query('DELETE FROM tindakan_pasien WHERE noRM = ?', [noRM]);

//     //   for (const t of tindakan) {
//     //     await conn.query(
//     //       'INSERT INTO tindakan_pasien (noRM, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs) VALUES (?, ?, ?, ?, ?)',
//     //       [noRM, t.kode_tindakan, t.nama_tindakan, t.harga_umum, t.harga_bpjs]
//     //     );
//     //   }
//     for (const t of tindakan) {
//   // Jika data tidak lengkap, skip
//   if (!t.kode_tindakan || !t.nama_tindakan || !t.harga_umum || !t.harga_bpjs) {
//     console.warn('❗ Data tindakan tidak lengkap, dilewati:', t);
//     continue;
//   }

//   await conn.query(
//     'INSERT INTO tindakan_pasien (noRM, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs) VALUES (?, ?, ?, ?, ?)',
//     [noRM, t.kode_tindakan, t.nama_tindakan, t.harga_umum, t.harga_bpjs]
//   );
// }


//       await conn.end();
//       return res.status(200).json({ message: 'Data tindakan berhasil disimpan' });
//     }

//     // Jika method bukan GET/POST
//     await conn.end();
//     return res.status(405).json({ message: 'Method not allowed' });

//   } catch (error) {
//     console.error('Database Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//   }
// }

// src/pages/api/tindakan.js
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
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
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

    if (req.method === 'GET') {
      const [rows] = await pool.query('SELECT id_tindakan, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs FROM master_data_tindakan');
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { noRM, tindakan } = req.body;
      if (!noRM || !Array.isArray(tindakan)) return res.status(400).json({ message: 'Data tidak valid.' });

      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query('DELETE FROM tindakan_pasien WHERE noRM = ?', [noRM]);

        for (const t of tindakan) {
          if (!t || !t.kode_tindakan || !t.nama_tindakan) {
            console.warn('❗ Data tindakan tidak lengkap, dilewati:', t);
            continue;
          }
          await conn.query(
            'INSERT INTO tindakan_pasien (noRM, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs) VALUES (?, ?, ?, ?, ?)',
            [noRM, t.kode_tindakan, t.nama_tindakan, t.harga_umum || 0, t.harga_bpjs || 0]
          );
        }

        await conn.commit();
        conn.release();
        return res.status(200).json({ message: 'Data tindakan berhasil disimpan' });
      } catch (e) {
        await conn.rollback();
        conn.release();
        throw e;
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('🔥 SQL Error (tindakan):', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error?.message ?? String(error) });
  }
}




// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query('SELECT * FROM master_data_tindakan');
//     await connection.end();

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching obat:', error);
//     res.status(500).json({ message: 'Terjadi kesalahan di server', error: error.message });
//   }
// }


//JANGANNN DIHAPUS YAA IKIII
// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const dbConfig = {
//     host: 'localhost',
//     user: 'root', // Sesuaikan dengan user MySQL Anda
//     password: 'Bekasibarat12', // Sesuaikan dengan password MySQL Anda
//     database: 'emr_db',
//   };

//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute('SELECT id_tindakan, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs FROM master_data_tindakan');
//     connection.end();

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error('Database Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
//   }
// }




// // /pages/api/saveTindakan.js
// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { noRM, tindakan } = req.body;

//   try {
//     const conn = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     // Bersihkan data lama dulu
//     await conn.query('DELETE FROM tindakan_pasien WHERE noRM = ?', [noRM]);

//     for (const t of tindakan) {
//       await conn.query(
//         'INSERT INTO tindakan_pasien (noRM, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs) VALUES (?, ?, ?, ?, ?)',
//         [noRM, t.kode_tindakan, t.nama_tindakan, t.harga_umum, t.harga_bpjs]
//       );
//     }

//     await conn.end();
//     res.status(200).json({ message: 'Data tindakan berhasil disimpan' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Gagal menyimpan data tindakan' });
//   }
// }


// import mysql from 'mysql2/promise';

// export default async function handler(req, res) {
//   const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: 'Bekasibarat12',
//     database: 'emr_db',
//   };

//   try {
//     const conn = await mysql.createConnection(dbConfig);

//     // ✅ METHOD GET → Ambil daftar semua tindakan dari master_data_tindakan
//     if (req.method === 'GET') {
//       const [rows] = await conn.execute(
//         'SELECT id_tindakan, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs FROM master_data_tindakan'
//       );
//       await conn.end();
//       return res.status(200).json(rows);
//     }

//     // ✅ METHOD POST → Simpan tindakan yang dipilih berdasarkan pasien (noRM)
//     if (req.method === 'POST') {
//       const { noRM, tindakan } = req.body;

//       if (!noRM || !Array.isArray(tindakan)) {
//         return res.status(400).json({ message: 'Data tidak valid.' });
//       }

//       // Bersihkan data tindakan lama
//       await conn.query('DELETE FROM tindakan_pasien WHERE noRM = ?', [noRM]);

//       for (const t of tindakan) {
//         await conn.query(
//           'INSERT INTO tindakan_pasien (noRM, kode_tindakan, nama_tindakan, harga_umum, harga_bpjs) VALUES (?, ?, ?, ?, ?)',
//           [noRM, t.kode_tindakan, t.nama_tindakan, t.harga_umum, t.harga_bpjs]
//         );
//       }

//       await conn.end();
//       return res.status(200).json({ message: 'Data tindakan berhasil disimpan' });
//     }

//     // Jika method bukan GET/POST
//     await conn.end();
//     return res.status(405).json({ message: 'Method not allowed' });

//   } catch (error) {
//     console.error('Database Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
//   }
// }