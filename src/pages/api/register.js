//JANGAN DIHAPUS
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     // const { username, password } = req.body;

//     // if (!username || !password) {
//     //   return res.status(400).json({ message: 'Harap isi semua field' });
//     // }

//     const { username, password, role } = req.body;

// if (!username || !password || !role) {
//   return res.status(400).json({ message: 'Harap isi semua field' });
// }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       const hashedPassword = await bcrypt.hash(password, 10);
//       await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
//         username,
//         hashedPassword,
//         role,
//       ]);

//       await connection.end();
//       res.status(200).json({ message: 'Registrasi berhasil' });
//     } catch (error) {
//       res.status(500).json({ message: 'Terjadi kesalahan' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


//SERIUSS BANGET INI IKI JANGAN DIHAPUS YAA IKIIII
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { username, password, role } = req.body;

//   if (!username || !password || !role) {
//     return res.status(400).json({ message: 'Harap isi semua field' });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [existingUsers] = await connection.query(
//       'SELECT * FROM users WHERE username = ?',
//       [username]
//     );

//     if (existingUsers.length > 0) {
//       return res.status(400).json({ message: 'Username sudah digunakan' });
//     }

//     console.log("🚀 Password yang diterima dari frontend:", password);

//     // **Tambahkan `.trim()` untuk menghindari karakter tidak sengaja**
//     const hashedPassword = await bcrypt.hash(password.trim(), 10);

//     console.log("🔐 Password setelah hashing:", hashedPassword);

//     await connection.query(
//       'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
//       [username, hashedPassword, role]
//     );

//     await connection.end();
    
//     res.status(200).json({
//       message: 'Registrasi berhasil',
//       hashedPassword: hashedPassword // Kirim hash ke frontend agar bisa disalin
//     });

//   } catch (error) {
//     console.error("❌ Error API Register:", error);
//     res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }





//ini jangan dihapus ya kii ini main nya kepalanya
// // ✅ REGISTER API - VALIDASI PASSWORD, OTP, AUDIT LOG
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';
// //code src/pages/api/register.js

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { username, password, role, otp_secret } = req.body;

//   if (!username || !password || !role || !otp_secret) {
//     return res.status(400).json({ message: 'Harap isi semua field' });
//   }

//   const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
//   if (!policy.test(password)) {
//     return res.status(400).json({ message: 'Password tidak memenuhi ketentuan keamanan' });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [existingUsers] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

//     if (existingUsers.length > 0) {
//       return res.status(400).json({ message: 'Username sudah digunakan' });
//     }

//     const hashedPassword = await bcrypt.hash(password.trim(), 10);

//     await connection.query(
//       'INSERT INTO users (username, password, role, otp_secret) VALUES (?, ?, ?, ?)',
//       [username, hashedPassword, role, otp_secret]
//     );

//     // Audit log
//     await connection.query(
//       'INSERT INTO audit_logs (user_id, action, table_name, record_id, timestamp) VALUES (?, ?, ?, ?, NOW())',
//       [0, 'REGISTER', 'users', null]
//     );

//     await connection.end();

//     res.status(200).json({
//       message: 'Registrasi berhasil',
//       hashedPassword: hashedPassword
//     });

//   } catch (error) {
//     console.error("❌ Error API Register:", error);
//     res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }


// src/pages/api/register.js
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';

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
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app/');
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

  const { username, password, role, otp_secret } = req.body;
  if (!username || !password || !role || !otp_secret) return res.status(400).json({ message: 'Harap isi semua field' });

  const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
  if (!policy.test(password)) return res.status(400).json({ message: 'Password tidak memenuhi ketentuan keamanan' });

  try {
    const pool = getPool();
    const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing && existing.length > 0) return res.status(400).json({ message: 'Username sudah digunakan' });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const [result] = await pool.query('INSERT INTO users (username, password, role, otp_secret, created_at) VALUES (?, ?, ?, ?, NOW())', [username, hashedPassword, role, otp_secret]);

    // Audit log (user_id bisa diisi id baru jika perlu)
    await pool.query('INSERT INTO audit_logs (user_id, action, table_name, record_id, timestamp) VALUES (?, ?, ?, ?, NOW())', [result.insertId || 0, 'REGISTER', 'users', result.insertId || null]);

    return res.status(200).json({ message: 'Registrasi berhasil' });
  } catch (error) {
    console.error('❌ Error API Register:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan' });
  }
}
