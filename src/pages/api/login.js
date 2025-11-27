// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     try {
//       // Koneksi ke database
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       // Cek apakah username ada di database
//       const [users] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

//       // Tutup koneksi database
//       await connection.end();

//       if (users.length === 0) {
//         return res.status(401).json({ message: 'Username tidak ditemukan' });
//       }

//       // Verifikasi password menggunakan bcrypt.compare
//       const isPasswordValid = await bcrypt.compare(password, users[0].password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Password salah' });
//       }

//       // Login berhasil
//       return res.status(200).json({ message: 'Login berhasil' });
//     } catch (error) {
//       return res.status(500).json({ message: 'Terjadi kesalahan di server' });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method tidak diizinkan' });
//   }
// }


//JANGAN DIHAPUS
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: 'Harap isi semua field' });
//     }

//     try {
//       const connection = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'Bekasibarat12',
//         database: 'emr_db',
//       });

//       const [rows] = await connection.query(
//         'SELECT * FROM users WHERE username = ?',
//         [username]
//       );

//       if (rows.length === 0) {
//         return res.status(401).json({ message: 'Username tidak ditemukan' });
//       }

//       const user = rows[0];
//       const isPasswordValid = await bcrypt.compare(password, user.password);

//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Password salah' });
//       }

//       // Simpan role ke dalam cookie
//       setCookie({ res }, 'userRole', user.role, {
//         httpOnly: true,
//         maxAge: 60 * 60 * 24,
//         path: '/',
//       });

//       res.status(200).json({ message: 'Login berhasil' });
//     } catch (error) {
//       res.status(500).json({ message: 'Terjadi kesalahan' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

//INI SERIUS BANGET IKI JANGAN DIHAPUS YAA IKIIIII
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Harap isi semua field' });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query(
//       'SELECT * FROM users WHERE username = ?',
//       [username]
//     );

//     if (!rows || rows.length === 0) {
//       console.log("❌ Username tidak ditemukan.");
//       return res.status(401).json({ message: 'Username tidak ditemukan' });
//     }

//     const user = rows[0];
//     const hashedPassword = user.password;

//     console.log("🔐 Password yang dikirim:", password.trim());
//     console.log("🔑 Password hash dari database:", hashedPassword);

//     // Perbandingan password asli dengan hash
//     const isPasswordValid = await bcrypt.compare(password.trim(), hashedPassword);
    
//     // Jika user menggunakan hash hasil salinan, langsung cek kesamaan string
//     const isSameHash = password.trim() === hashedPassword;

//     console.log("✅ Hasil bcrypt.compare:", isPasswordValid);
//     console.log("✅ Apakah password sama dengan hash yang disimpan?", isSameHash);

//     if (!isPasswordValid && !isSameHash) {
//       console.log("❌ Password salah.");
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     setCookie({ res }, 'userRole', user.role, {
//       httpOnly: true,
//       maxAge: 60 * 60 * 24,
//       path: '/',
//     });

//     await connection.end();

//     res.status(200).json({ message: 'Login berhasil' });

//   } catch (error) {
//     console.error("❌ Error API Login:", error);
//     res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }





// ✅ LOGIN API - KEAMANAN DITINGKATKAN DENGAN 2FA & BLOKIR AKUN
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { username, password, otp } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Harap isi semua field' });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

//     if (!rows || rows.length === 0) {
//       return res.status(401).json({ message: 'Username tidak ditemukan' });
//     }

//     const user = rows[0];

//     // ✅ Cek apakah user diblokir sementara
//     const [attempts] = await connection.query(`
//       SELECT COUNT(*) as failedAttempts, MAX(attempt_time) as lastAttempt
//       FROM login_attempts
//       WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)
//     `, [username]);

//     const { failedAttempts, lastAttempt } = attempts[0];
//     if (failedAttempts >= 3) {
//       return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi dalam 10 menit.' });
//     }

//     // ✅ Cek password
//     const hashedPassword = user.password;
//     const isPasswordValid = await bcrypt.compare(password.trim(), hashedPassword);
//     const isSameHash = password.trim() === hashedPassword;

//     if (!isPasswordValid && !isSameHash) {
//       await connection.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, ?, NOW())', [username, 0]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     // ✅ OTP Verification (2FA)
//     if (user.otp_secret && otp !== user.otp_secret) {
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     // ✅ Login sukses
//     await connection.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await connection.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, ?, NOW())', [username, 1]);

//     setCookie({ res }, 'userRole', user.role, {
//       httpOnly: true,
//       maxAge: 30 * 60, // 30 menit idle timeout
//       path: '/',
//     });

//     await connection.end();

//     res.status(200).json({ message: 'Login berhasil' });

//   } catch (error) {
//     console.error("❌ Error API Login:", error);
//     res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }

// // ✅ LOGIN API - KEAMANAN DITINGKATKAN DENGAN 2FA & BLOKIR AKUN (OTP disimpan di database), ini jangan dihapus yaa ki ini mainnya atau kepalanya
// import mysql from 'mysql2/promise';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';
// //code src/pages/api/login.js

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { username, password, otp } = req.body;

//   if (!username || !password || !otp) {
//     return res.status(400).json({ message: 'Harap isi semua field' });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'Bekasibarat12',
//       database: 'emr_db',
//     });

//     const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

//     if (!rows || rows.length === 0) {
//       return res.status(401).json({ message: 'Username tidak ditemukan' });
//     }

//     const user = rows[0];

//     const [attempts] = await connection.query(`
//       SELECT COUNT(*) as failedAttempts, MAX(attempt_time) as lastAttempt
//       FROM login_attempts
//       WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)
//     `, [username]);

//     const { failedAttempts } = attempts[0];
//     if (failedAttempts >= 3) {
//       return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi dalam 10 menit.' });
//     }

//     const hashedPassword = user.password;
//     const isPasswordValid = await bcrypt.compare(password.trim(), hashedPassword);
//     const isSameHash = password.trim() === hashedPassword;

//     if (!isPasswordValid && !isSameHash) {
//       await connection.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, ?, NOW())', [username, 0]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     if (user.otp_secret !== otp) {
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     await connection.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await connection.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, ?, NOW())', [username, 1]);

//     setCookie({ res }, 'userRole', user.role, {
//       httpOnly: true,
//       maxAge: 30 * 60,
//       path: '/',
//     });

//     await connection.end();

//     res.status(200).json({ message: 'Login berhasil' });

//   } catch (error) {
//     console.error("❌ Error API Login:", error);
//     res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }




// // src/pages/api/login.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { username, password, otp } = req.body;
//   if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

//   try {
//     const pool = getPool();

//     const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
//     if (!users || users.length === 0) {
//       // record attempt (optional) could be done here
//       return res.status(401).json({ message: 'Username tidak ditemukan' });
//     }
//     const user = users[0];

//     // cek jumlah percobaan gagal dalam 15 menit terakhir
//     const [attemptsRows] = await pool.query(
//       `SELECT COUNT(*) as failedAttempts
//        FROM login_attempts
//        WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
//       [username]
//     );
//     const failedAttempts = attemptsRows[0]?.failedAttempts || 0;
//     if (failedAttempts >= 3) {
//       return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi dalam 10 menit.' });
//     }

//     // verifikasi password
//     const isPasswordValid = await bcrypt.compare(password.trim(), user.password || '');
//     if (!isPasswordValid) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     // verifikasi OTP (sederhana: cocokkan dengan value tersimpan)
//     if (!user.otp_secret || String(user.otp_secret) !== String(otp)) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     // sukses: update last_login dan simpan log percobaan sukses
//     await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

//     // set cookie role (httpOnly)
//     setCookie({ res }, 'userRole', user.role || 'user', {
//       httpOnly: true,
//       maxAge: 30 * 60, // 30 menit
//       path: '/',
//     });

//     return res.status(200).json({ message: 'Login berhasil' });
//   } catch (error) {
//     console.error('❌ Error API Login:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }



// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// export default async function handler(req, res) {
// if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

// const { username, password, otp } = req.body;
// if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

// try {
// const pool = getPool();


// const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
// if (!users || users.length === 0) {
//   // record attempt (optional) could be done here
//   return res.status(401).json({ message: 'Username tidak ditemukan' });
// }
// const user = users[0];

// // cek jumlah percobaan gagal dalam 15 menit terakhir
// const [attemptsRows] = await pool.query(
//   `SELECT COUNT(*) as failedAttempts
//    FROM login_attempts
//    WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
//   [username]
// );
// const failedAttempts = attemptsRows[0]?.failedAttempts || 0;
// if (failedAttempts >= 3) {
//   return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi dalam 10 menit.' });
// }

// // verifikasi password (bcrypt + fallback hash)
// const isPasswordValid = await bcrypt.compare(password.trim(), user.password || '');
// const isSameHash = password.trim() === user.password; // fallback jika user pakai hash lama
// if (!isPasswordValid && !isSameHash) {
//   await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//   return res.status(401).json({ message: 'Password salah' });
// }

// // verifikasi OTP (sederhana: cocokkan dengan value tersimpan)
// if (!user.otp_secret || String(user.otp_secret) !== String(otp)) {
//   await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//   return res.status(401).json({ message: 'OTP tidak valid' });
// }

// // sukses: update last_login dan simpan log percobaan sukses
// await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
// await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

// // set cookie role (httpOnly)
// setCookie({ res }, 'userRole', user.role || 'user', {
//   httpOnly: true,
//   maxAge: 30 * 60, // 30 menit
//   path: '/',
// });

// return res.status(200).json({ message: 'Login berhasil' });


// } catch (error) {
// console.error('❌ Error API Login:', error);
// return res.status(500).json({ message: 'Terjadi kesalahan' });
// }
// }



// // src/pages/api/login.js // jangan hapus dulu ya ki yaa wkwkwk
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// const ALLOWED_ORIGINS = [
//   'http://localhost:3000',
//   'http://127.0.0.1:3000',
//   'https://emr-ueu.web.app',
//   'https://emr-ueu.firebaseapp.com', // jika perlu
//   // tambahkan origin lain yang harus diizinkan
// ];

// const ALLOWED_ORIGINS2 = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000')
//   .split(',')
//   .map(s => s.trim())
//   .filter(Boolean);

// /**
//  * Helper kecil untuk menangani CORS pada setiap API route.
//  * - Set header Access-Control-Allow-Origin hanya untuk origin yang diizinkan.
//  * - Handle preflight OPTIONS (mengembalikan 204).
//  */
// function handleCors(req, res) {
//   const origin = req.headers.origin;
//   const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : (ALLOWED_ORIGINS[0] || '*');

//   // Jangan pakai wildcard '*' kalau Anda ingin mengirim cookie atau header credentials.
//   res.setHeader('Access-Control-Allow-Origin', allowOrigin);
//   res.setHeader('Vary', 'Origin'); // penting jika allowed dynamic
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//   // jika frontend butuh mengirim cookie / auth header ke backend, aktifkan ini:
//   // res.setHeader('Access-Control-Allow-Credentials', 'true');

//   // handle preflight
//   if (req.method === 'OPTIONS') {
//     res.status(204).end();
//     return true; // menandakan preflight sudah di-handle
//   }
//   return false;
// }

// export default async function handler(req, res) {

//   const origin = req.headers.origin;

//   // Set CORS headers if origin is allowed
//   if (origin && ALLOWED_ORIGINS.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
//     // Jika front-end butuh mengirim cookie/session, aktifkan credentials dan pastikan origin bukan '*'
//     // res.setHeader('Access-Control-Allow-Credentials', 'true');
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

//   // --- CORS handling (preflight + headers) ---
//   if (handleCors(req, res)) return; // preflight selesai

//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//   const { username, password, otp } = req.body;
//   if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

//   try {
//     const pool = getPool();

//     const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
//     if (!users || users.length === 0) {
//       // record attempt (optional) could be done here
//       return res.status(401).json({ message: 'Username tidak ditemukan' });
//     }
//     const user = users[0];

//     // cek jumlah percobaan gagal dalam 15 menit terakhir
//     const [attemptsRows] = await pool.query(
//       `SELECT COUNT(*) as failedAttempts
//        FROM login_attempts
//        WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
//       [username]
//     );
//     const failedAttempts = attemptsRows[0]?.failedAttempts || 0;
//     if (failedAttempts >= 3) {
//       return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi dalam 10 menit.' });
//     }

//     // verifikasi password (bcrypt + fallback hash)
//     const isPasswordValid = await bcrypt.compare(password.trim(), user.password || '');
//     const isSameHash = password.trim() === user.password; // fallback jika user pakai hash lama
//     if (!isPasswordValid && !isSameHash) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     // verifikasi OTP (sederhana: cocokkan dengan value tersimpan)
//     if (!user.otp_secret || String(user.otp_secret) !== String(otp)) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     // sukses: update last_login dan simpan log percobaan sukses
//     await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

//     // set cookie role (httpOnly)
//     // NOTE: jika Anda ingin cookie lintas-domain (frontend di firebase, backend di vercel),
//     // perlu Aturan SameSite & pengaturan secure serta BACKEND harus men-set Access-Control-Allow-Credentials: true
//     setCookie({ res }, 'userRole', user.role || 'user', {
//       httpOnly: true,
//       maxAge: 30 * 60, // 30 menit
//       path: '/',
//       // sameSite: 'lax', secure: true, // uncomment jika pakai HTTPS di production
//     });

//     return res.status(200).json({ message: 'Login berhasil' });
//   } catch (error) {
//     console.error('❌ Error API Login:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }



// src/pages/api/login.js
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { setCookie } from 'nookies';

const ALLOWED_ORIGINS = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000,https://emr-ueu.web.app')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function setCors(res, origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    // jika ingin browser menyimpan cookie cross-site:
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    // origin tidak di-whitelist -> kita set header ke origin pertama agar preflight tidak gagal total
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0] || '*');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);

  // handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // basic validation
  const { username, password, otp } = req.body || {};
  if (!username || !password || !otp) {
    return res.status(400).json({ message: 'Harap isi semua field' });
  }

  try {
    // pastikan getPool tidak me-return undefined
    const pool = getPool();
    if (!pool) {
      console.error('❌ getPool() mengembalikan undefined/null. Periksa konfigurasi DB (env vars).');
      return res.status(500).json({ message: 'Internal server error (DB pool)' });
    }

    // ambil user
    const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (!Array.isArray(users) || users.length === 0) {
      // optional: log untuk dev, jangan expose detail ke client
      console.warn(`Login attempt: username not found -> ${username}`);
      return res.status(401).json({ message: 'Username tidak ditemukan' });
    }
    const user = users[0];

    // Pastikan kolom yg diperlukan ada
    if (!('password' in user)) {
      console.error('❌ Struktur tabel users tidak memiliki kolom "password". Row:', user);
      return res.status(500).json({ message: 'Internal server error (user schema)' });
    }

    // cek percobaan gagal
    const [attemptsRows] = await pool.query(
      `SELECT COUNT(*) as failedAttempts
       FROM login_attempts
       WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
      [username]
    );
    const failedAttempts = attemptsRows?.[0]?.failedAttempts ?? 0;
    if (failedAttempts >= 3) {
      return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi nanti.' });
    }

    // verifikasi password defensif
    const storedPassword = user.password ?? '';
    let isPasswordValid = false;
    try {
      // bcrypt.compare toleran terhadap string kosong, tapi pastikan argumen string
      isPasswordValid = await bcrypt.compare(String(password).trim(), String(storedPassword));
    } catch (bcryptErr) {
      console.error('❌ bcrypt.compare error:', bcryptErr);
      // fallback: bandingkan plaintext (tidak direkomendasikan) jika storedPassword sama persis
      isPasswordValid = String(password).trim() === String(storedPassword);
    }

    const isSameHash = String(password).trim() === String(storedPassword);
    if (!isPasswordValid && !isSameHash) {
      await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
      return res.status(401).json({ message: 'Password salah' });
    }

    // verifikasi OTP
    const userOtpSecret = user.otp_secret ?? user.otp ?? null;
    if (!userOtpSecret || String(userOtpSecret) !== String(otp)) {
      await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
      return res.status(401).json({ message: 'OTP tidak valid' });
    }

    // update last_login & log success
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

    // set cookie role (httpOnly). NOTE: untuk cookie cross-site, perlu Access-Control-Allow-Credentials: true di header
    setCookie({ res }, 'userRole', user.role || 'user', {
      httpOnly: true,
      maxAge: 30 * 60,
      path: '/',
      // sameSite: 'lax', secure: true
    });

    return res.status(200).json({ message: 'Login berhasil' });
  } catch (err) {
    // Log stack trace lengkap agar Vercel logs memberi detail
    console.error('❌ Error API /api/login:', err && (err.stack || err.message || err));
    // kembalikan pesan generik
    return res.status(500).json({ message: 'Terjadi kesalahan' });
  }
}
