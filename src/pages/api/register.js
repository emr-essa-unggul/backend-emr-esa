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

//backend-emr-esa/src/pages/api/register.js
// src/pages/api/register.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';

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
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
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

//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { username, password, role, otp_secret } = req.body;
//   if (!username || !password || !role || !otp_secret) return res.status(400).json({ message: 'Harap isi semua field' });

//   const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
//   if (!policy.test(password)) return res.status(400).json({ message: 'Password tidak memenuhi ketentuan keamanan' });

//   try {
//     const pool = getPool();
//     const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
//     if (existing && existing.length > 0) return res.status(400).json({ message: 'Username sudah digunakan' });

//     const hashedPassword = await bcrypt.hash(password.trim(), 10);
//     const [result] = await pool.query('INSERT INTO users (username, password, role, otp_secret, created_at) VALUES (?, ?, ?, ?, NOW())', [username, hashedPassword, role, otp_secret]);

//     // Audit log (user_id bisa diisi id baru jika perlu)
//     await pool.query('INSERT INTO audit_logs (user_id, action, table_name, record_id, timestamp) VALUES (?, ?, ?, ?, NOW())', [result.insertId || 0, 'REGISTER', 'users', result.insertId || null]);

//     return res.status(200).json({ message: 'Registrasi berhasil' });
//   } catch (error) {
//     console.error('❌ Error API Register:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }


// //backend-emr-esa/src/pages/api/register.js //JANGAN DIAPA2 IN YAA KI INI YANG UDAH FIXXX
// // src/pages/api/register.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';

// // allowed origins (sesuaikan env jika perlu)
// const ALLOWED_ORIGINS = [
//   'http://localhost:3000',
//   'http://127.0.0.1:3000',
//   'https://emr-ueu.web.app',
//   'https://emr-ueu.firebaseapp.com',
// ];

// function applyCors(req, res) {
//   const origin = req.headers.origin;
//   res.setHeader('Vary', 'Origin');
//   if (!origin) {
//     res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
//     return;
//   }
//   if (ALLOWED_ORIGINS.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//   }
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// }

// export default async function handler(req, res) {
//   try {
//     applyCors(req, res);

//     if (req.method === 'OPTIONS') return res.status(200).end();
//     if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//     // sangat berguna untuk debug: log body singkat (jangan log password di prod)
//     console.log('REGISTER body keys:', Object.keys(req.body));

//     const { username, password, role, otp_secret } = req.body || {};
//     if (!username || !password || !role || !otp_secret) {
//       console.warn('Missing fields:', { username, role, hasPassword: !!password, hasOtp: !!otp_secret });
//       return res.status(400).json({ message: 'Harap isi semua field' });
//     }

//     const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
//     if (!policy.test(password)) {
//       return res.status(400).json({ message: 'Password tidak memenuhi ketentuan keamanan' });
//     }

//     const pool = getPool();
//     if (!pool) {
//       console.error('DB pool is falsy');
//       return res.status(500).json({ message: 'DB connection error (pool missing)' });
//     }

//     // cek username exist
//     const [existing] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
//     if (Array.isArray(existing) && existing.length > 0) {
//       return res.status(400).json({ message: 'Username sudah digunakan' });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(String(password).trim(), 10);

//     // lakukan insert — laporkan kolom yang dipakai agar tidak error karena schema mismatch
//     // const insertSql = 'INSERT INTO users (username, password, role, otp_secret, created_at) VALUES (?, ?, ?, ?, NOW())';
//     // const params = [username, hashedPassword, role, otp_secret];
//     const insertSql = 'INSERT INTO users (username, password, role, otp_secret) VALUES (?, ?, ?, ?)';
//     const params = [username, hashedPassword, role, otp_secret];

//     let result;
//     try {
//       [result] = await pool.query(insertSql, params);
//     } catch (sqlErr) {
//       // tangkap error SQL detail untuk debugging
//       console.error('SQL INSERT error:', sqlErr && sqlErr.code, sqlErr && sqlErr.sqlMessage);
//       // kirim pesan user-friendly + code untuk admin debugging
//       return res.status(500).json({ message: 'DB insert error', detail: sqlErr && sqlErr.message });
//     }

//     // audit log (jangan blokir register jika audit gagal — tapi log)
//     try {
//       await pool.query(
//         // 'INSERT INTO audit_logs (user_id, action, table_name, record_id, timestamp) VALUES (?, ?, ?, ?, NOW())',
//         'INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES (?, ?, ?, ?)',
//         [result.insertId || 0, 'REGISTER', 'users', result.insertId || null]
//       );
//     } catch (auditErr) {
//       console.warn('Audit log failed:', auditErr && auditErr.message);
//       // continue tanpa mengembalikan error
//     }

//     // sukses — kembalikan hashedPassword juga (berguna untuk debug/frontend)
//     return res.status(200).json({
//       message: 'Registrasi berhasil',
//       insertedId: result.insertId || null,
//       hashedPassword,
//     });
//   } catch (error) {
//     // stack lengkap agar bisa dibaca di logs Vercel/Railway
//     console.error('❌ Error API Register (handler):', error && error.stack ? error.stack : error);
//     return res.status(500).json({ message: 'Terjadi kesalahan', error: String(error && error.message ? error.message : error) });
//   }
// }




// backend-emr-esa/src/pages/api/register.js
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// allowed origins (sesuaikan env jika perlu)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://emr-ueu.web.app',
  'https://emr-ueu.firebaseapp.com',
];

// function applyCors(req, res) {
//   const origin = req.headers.origin;
//   res.setHeader('Vary', 'Origin');
//   if (!origin) {
//     res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
//     return;
//   }
//   if (ALLOWED_ORIGINS.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//   }
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// }

function applyCors(req, res) {
  const origin = req.headers.origin;

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // fallback aman (WAJIB ADA untuk preflight)
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
  }
}


const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || 'YOUR_RECAPTCHA_SECRET';

const nodemailer = require('nodemailer');

// Konfigurasi transporter (gunakan Gmail atau SMTP lain)
const transporter = nodemailer.createTransport({
  service: 'gmail', // atau 'smtp.gmail.com' untuk custom
  auth: {
    user: process.env.EMAIL_USER, // Email pengirim (misal: 'yourgmail@gmail.com')
    pass: process.env.EMAIL_PASS, // Password atau App Password Gmail
  },
});

// verify reCAPTCHA v3 token
async function verifyRecaptcha(token, remoteip = null) {
  if (!token) return { success: false, message: 'No token provided' };
  const params = new URLSearchParams();
  params.append('secret', RECAPTCHA_SECRET);
  params.append('response', token);
  if (remoteip) params.append('remoteip', remoteip);

  try {
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await resp.json();
    // data: { success, score, action, challenge_ts, hostname, ... }
    return data;
  } catch (err) {
    console.error('reCAPTCHA verify error:', err);
    return { success: false, error: String(err) };
  }
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    // applyCors(req, res);

    // if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowedd' });

    console.log('REGISTER body keys:', Object.keys(req.body));

    const { username, password, email, role, otp_secret, recaptchaToken, recaptchaAction } = req.body || {};
    if (!username || !password || !email || !role || !otp_secret) {
      console.warn('Missing fields:', { username, email, role, hasPassword: !!password, hasOtp: !!otp_secret });
      return res.status(400).json({ message: 'Harap isi semua field' });
    }

    if (!RECAPTCHA_SECRET || RECAPTCHA_SECRET === 'YOUR_RECAPTCHA_SECRET') {
      console.warn('RECAPTCHA secret not configured on server. Set RECAPTCHA_SECRET_KEY env var.');
      return res.status(500).json({ message: 'Server reCAPTCHA belum dikonfigurasi' });
    }

    // verify recaptcha v3
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, req.headers['x-forwarded-for'] || req.socket.remoteAddress || null);
    if (!recaptchaResult || !recaptchaResult.success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult);
      return res.status(400).json({ message: 'Gagal verifikasi reCAPTCHA' });
    }

    // check action and score
    // action should match 'register' (from frontend)
    const expectedAction = recaptchaAction || 'register';
    const minScore = 0.5; // adjust threshold as needed
    if (recaptchaResult.action && recaptchaResult.action !== expectedAction) {
      console.warn('reCAPTCHA action mismatch:', recaptchaResult.action, 'expected:', expectedAction);
      return res.status(400).json({ message: 'reCAPTCHA action mismatch' });
    }
    const score = typeof recaptchaResult.score === 'number' ? recaptchaResult.score : 0;
    if (score < minScore) {
      console.warn('Low reCAPTCHA score:', score);
      // you can choose 1) reject 2) allow with additional checks. Here we reject.
      return res.status(400).json({ message: 'Interaksi terdeteksi mencurigakan (score rendah)' });
    }

    const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!policy.test(password)) {
      return res.status(400).json({ message: 'Password tidak memenuhi ketentuan keamanan' });
    }

    const pool = getPool();
    if (!pool) {
      console.error('DB pool is falsy');
      return res.status(500).json({ message: 'DB connection error (pool missing)' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', [username]);
    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(String(password).trim(), 10);

    const insertSql = 'INSERT INTO users (username, email, password, role, otp_secret) VALUES (?, ?, ?, ?, ?)';
    const params = [username, email, hashedPassword, role, otp_secret];

    let result;
    try {
      [result] = await pool.query(insertSql, params);
    } catch (sqlErr) {
      console.error('SQL INSERT error:', sqlErr && sqlErr.code, sqlErr && sqlErr.sqlMessage);
      return res.status(500).json({ message: 'DB insert error', detail: sqlErr && sqlErr.message });
    }

    // Kirim email ke pengguna dan admin
try {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [email, 'rrizki402@gmail.com', 'dokumentasirizki1@gmail.com'], // Email pengguna + admin
    subject: 'Registrasi Berhasil - OTP dan Password',
    html: `
      <h2>Registrasi Berhasil!</h2>
      <p>OTP (2FA) Anda: <strong>${otp_secret}</strong></p>
      <p>Password telah dienkripsi: <br/><textarea readonly>${hashedPassword}</textarea></p>
      <p>Silakan login dan gunakan OTP untuk verifikasi.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully');
} catch (emailErr) {
  console.error('Email send error:', emailErr);
  // Jangan gagal registrasi jika email gagal
}

    try {
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES (?, ?, ?, ?)',
        [result.insertId || 0, 'REGISTER', 'users', result.insertId || null]
      );
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr && auditErr.message);
    }

    return res.status(200).json({
      message: 'Registrasi berhasil',
      insertedId: result.insertId || null,
      hashedPassword,
    });
  } catch (error) {
    console.error('❌ Error API Register (handler):', error && error.stack ? error.stack : error);
    return res.status(500).json({ message: 'Terjadi kesalahan', error: String(error && error.message ? error.message : error) });
  }
}
