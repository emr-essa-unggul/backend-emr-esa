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



// // src/pages/api/login.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// // Ambil whitelist dari env (lebih fleksibel) — fallback menyertakan localhost + production origin
// const ALLOWED_ORIGINS = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000,https://emr-ueu.web.app')
//   .split(',')
//   .map(s => s.trim())
//   .filter(Boolean);

// // single helper CORS (deterministic — tidak menggunakan fallback ke ALLOWED_ORIGINS[0])
// function applyCors(req, res) {
//   const origin = req.headers.origin;

//   // Jika tidak ada origin (server-to-server / curl), ijinkan semua
//   if (!origin) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Vary', 'Origin');
//   } else if (ALLOWED_ORIGINS.includes(origin)) {
//     // ORIGIN DI-WHITELIST -> kembalikan origin yang persis sama
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
//     // jika perlu cookie cross-site, aktifkan baris berikut dan frontend harus memakai credentials: 'include'
//     // res.setHeader('Access-Control-Allow-Credentials', 'true');
//   } else {
//     // Origin tidak diizinkan — **jangan** set header Access-Control-Allow-Origin ke nilai fallback (mis localhost)
//     // Biarkan tanpa header sehingga browser akan memblokir. 
//     // (Kamu juga bisa mengembalikan 403 untuk preflight jika ingin stricter behaviour)
//     // NOTE: Tidak meng-set header mencegah header salah seperti 'http://localhost:3000' dikirim ke browser.
//   }

//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
// }

// // lalu di handler gunakan applyCors dan tangani preflight
// export default async function handler(req, res) {
//   try {
//     applyCors(req, res);

//     // Preflight: segera kembalikan 204 (tanpa menjalankan logic login)
//     if (req.method === 'OPTIONS') {
//       return res.status(204).end();
//     }

//     // keep your existing logic unchanged below...
//     if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//     const { username, password, otp } = req.body;
//     if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

//     const pool = getPool();
//     if (!pool) {
//       console.error('DB pool undefined');
//       return res.status(500).json({ message: 'Internal server error' });
//     }

//     const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
//     if (!Array.isArray(users) || users.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan' });
//     const user = users[0];

//     const [attemptsRows] = await pool.query(
//       `SELECT COUNT(*) as failedAttempts
//        FROM login_attempts
//        WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
//       [username]
//     );
//     const failedAttempts = attemptsRows?.[0]?.failedAttempts ?? 0;
//     if (failedAttempts >= 3) return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi nanti.' });

//     const storedPassword = user.password ?? '';
//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await bcrypt.compare(String(password).trim(), String(storedPassword));
//     } catch (bcryptErr) {
//       console.error('bcrypt error', bcryptErr);
//       isPasswordValid = String(password).trim() === String(storedPassword);
//     }
//     const isSameHash = String(password).trim() === String(storedPassword);
//     if (!isPasswordValid && !isSameHash) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     const userOtpSecret = user.otp_secret ?? user.otp ?? null;
//     if (!userOtpSecret || String(userOtpSecret) !== String(otp)) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

//     setCookie({ res }, 'userRole', user.role || 'user', {
//       httpOnly: true,
//       maxAge: 30 * 60,
//       path: '/',
//     });

//     return res.status(200).json({ message: 'Login berhasil' });
//   } catch (error) {
//     console.error('❌ Error API Login:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }


// // src/pages/api/login.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// // Allowed origins untuk CORS
// const ALLOWED_ORIGINS = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000,https://emr-ueu.web.app')
//   .split(',')
//   .map(s => s.trim())
//   .filter(Boolean);

// function applyCors(req, res) {
//   const origin = req.headers.origin;

//   if (!origin) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Vary', 'Origin');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//   } else if (ALLOWED_ORIGINS.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Vary', 'Origin');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//   }
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
// }

// export default async function handler(req, res) {
//   try {
//     applyCors(req, res);

//     // Preflight request
//     if (req.method === 'OPTIONS') return res.status(204).end();

//     if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//     const { username, password, otp } = req.body;
//     if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

//     const pool = getPool();
//     if (!pool) return res.status(500).json({ message: 'DB connection error' });

//     // Ambil user
//     const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
//     if (!Array.isArray(users) || users.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan' });

//     const user = users[0];

//     // Cek login attempts terakhir 15 menit
//     const [attemptsRows] = await pool.query(
//       `SELECT COUNT(*) as failedAttempts
//        FROM login_attempts
//        WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
//       [username]
//     );
//     const failedAttempts = attemptsRows?.[0]?.failedAttempts ?? 0;
//     if (failedAttempts >= 3) return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi nanti.' });

//     // Cek password
//     const storedPassword = user.password ?? '';
//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await bcrypt.compare(String(password).trim(), String(storedPassword));
//     } catch (err) {
//       isPasswordValid = String(password).trim() === String(storedPassword);
//     }

//     if (!isPasswordValid) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     // Cek OTP
//     const userOtpSecret = user.otp_secret ?? user.otp ?? null;
//     if (!userOtpSecret || String(userOtpSecret) !== String(otp)) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     // Update last login + simpan login attempt sukses
//     await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

//     // Set cookie
//     // setCookie({ res }, 'userRole', user.role || 'user', {
//     //   httpOnly: true,
//     //   maxAge: 30 * 60,
//     //   path: '/',
//     // });
//     setCookie({ res }, 'userRole', String(user.role || 'user'), {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production', // harus true di prod
//   sameSite: 'none', // penting untuk cookie cross-site
//   path: '/',
//   maxAge: 30 * 60, // 30 menit
// });


//     return res.status(200).json({ message: 'Login berhasil' });

//   } catch (error) {
//     console.error('❌ API Login Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }



// //backend login api dengan cors dan otp serta bcrypt
// // src/pages/api/login.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { setCookie } from 'nookies';

// // Allowed origins untuk CORS (bisa di-set via env BACKEND_ALLOWED_ORIGINS)
// const ALLOWED_ORIGINS = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000,https://emr-ueu.web.app')
//   .split(',')
//   .map(s => s.trim())
//   .filter(Boolean);

// function applyCors(req, res) {
//   const origin = req.headers.origin;

//   // Selalu beri tahu browser bahwa response bervariasi berdasarkan Origin
//   res.setHeader('Vary', 'Origin');
  

//   if (!origin) {
//     // request server-to-server / tools (curl). Jangan set credentials di kasus ini.
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//     return;
//   }

//   // Jika origin di whitelist -> set header spesifik origin + izinkan credentials
//   if (ALLOWED_ORIGINS.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // supaya browser mengirim cookie
//     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//     res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

//     return;
//   }

//   // Default: tidak set Access-Control-Allow-Origin (browser akan blokir)
//   // (kita sengaja tidak mengirim header kalau origin tidak diizinkan)
// }

// export default async function handler(req, res) {
//   try {
//     // Pasang header CORS sesuai origin
//     applyCors(req, res);

//     // Preflight request (OPTIONS)
//     if (req.method === 'OPTIONS') {
//       return res.status(204).end();
//     }

//     if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//     const { username, password, otp } = req.body;
//     if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

//     const pool = getPool();
//     if (!pool) return res.status(500).json({ message: 'DB connection error' });

//     // Ambil user
//     const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
//     if (!Array.isArray(users) || users.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan' });

//     const user = users[0];

//     // Cek login attempts terakhir 15 menit
//     const [attemptsRows] = await pool.query(
//       `SELECT COUNT(*) as failedAttempts
//        FROM login_attempts
//        WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
//       [username]
//     );
//     const failedAttempts = attemptsRows?.[0]?.failedAttempts ?? 0;
//     if (failedAttempts >= 3) return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi nanti.' });

//     // Cek password
//     const storedPassword = user.password ?? '';
//     let isPasswordValid = false;
//     try {
//       isPasswordValid = await bcrypt.compare(String(password).trim(), String(storedPassword));
//     } catch (err) {
//       // fallback jika password tidak ter-hash (legacy)
//       isPasswordValid = String(password).trim() === String(storedPassword);
//     }

//     if (!isPasswordValid) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'Password salah' });
//     }

//     // Cek OTP (sesuaikan logic OTP kamu)
//     const userOtpSecret = user.otp_secret ?? user.otp ?? null;
//     if (!userOtpSecret || String(userOtpSecret) !== String(otp)) {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
//       return res.status(401).json({ message: 'OTP tidak valid' });
//     }

//     // Update last login + simpan login attempt sukses
//     await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
//     await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

//     // Set cookie cross-site (httpOnly). Pastikan sameSite:none + secure:true di production
//     setCookie({ res }, 'userRole', String(user.role || 'user'), {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'none',
//       path: '/',
//       maxAge: 30 * 60, // 30 menit
//     });

//     // Kembalikan role juga agar frontend bisa langsung set UI (opsional)
//     return res.status(200).json({ message: 'Login berhasil', role: user.role || 'user' });

//   } catch (error) {
//     console.error('❌ API Login Error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan' });
//   }
// }



// src/pages/api/login.js
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { setCookie } from 'nookies';

// Allowed origins untuk CORS (bisa di-set via env BACKEND_ALLOWED_ORIGINS)
const ALLOWED_ORIGINS = (process.env.BACKEND_ALLOWED_ORIGINS || 'http://localhost:3000,https://emr-ueu.web.app')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function applyCors(req, res) {
  const origin = req.headers.origin;

  // Selalu beri tahu browser bahwa response bervariasi berdasarkan Origin
  res.setHeader('Vary', 'Origin');
  

  if (!origin) {
    // request server-to-server / tools (curl). Jangan set credentials di kasus ini.
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return;
  }

  // Jika origin di whitelist -> set header spesifik origin + izinkan credentials
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // supaya browser mengirim cookie
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

    return;
  }

  // Default: tidak set Access-Control-Allow-Origin (browser akan blokir)
  // (kita sengaja tidak mengirim header kalau origin tidak diizinkan)
}

function looksLikeBcryptHash(s) {
  if (!s || typeof s !== 'string') return false;
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(s);
}

export default async function handler(req, res) {
  try {
    // Pasang header CORS sesuai origin
    applyCors(req, res);

    // Preflight request (OPTIONS)
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { username, password, otp, isHash } = req.body || {};
    if (!username || !password || !otp) return res.status(400).json({ message: 'Harap isi semua field' });

    const pool = getPool();
    if (!pool) return res.status(500).json({ message: 'DB connection error' });

    // Ambil user
    const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (!Array.isArray(users) || users.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan' });

    const user = users[0];

    // Cek login attempts terakhir 15 menit
    const [attemptsRows] = await pool.query(
      `SELECT COUNT(*) as failedAttempts
       FROM login_attempts
       WHERE username = ? AND success = 0 AND attempt_time > (NOW() - INTERVAL 15 MINUTE)`,
      [username]
    );
    const failedAttempts = attemptsRows?.[0]?.failedAttempts ?? 0;
    if (failedAttempts >= 3) return res.status(429).json({ message: 'Terlalu banyak percobaan gagal. Coba lagi nanti.' });

    // Cek password
    const storedPassword = user.password ?? '';
    let isPasswordValid = false;

    try {
      // Jika client memberi tahu bahwa ia memasukkan hash langsung, bandingkan string hash langsung
      if (isHash === true || looksLikeBcryptHash(String(password))) {
        // bandingkan literal (hash string) — aman hanya jika client dipercaya
        if (String(password).trim() === String(storedPassword).trim()) {
          isPasswordValid = true;
        } else {
          isPasswordValid = false;
        }
      } else {
        // normal: compare plain candidate password vs stored hashed password
        isPasswordValid = await bcrypt.compare(String(password).trim(), String(storedPassword));
      }
    } catch (err) {
      // fallback jika terjadi error di bcrypt.compare
      isPasswordValid = String(password).trim() === String(storedPassword).trim();
    }

    if (!isPasswordValid) {
      await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
      return res.status(401).json({ message: 'Password salah' });
    }

    // Cek OTP (sesuaikan logic OTP kamu)
    const userOtpSecret = user.otp_secret ?? user.otp ?? null;
    if (!userOtpSecret || String(userOtpSecret) !== String(otp)) {
      await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 0, NOW())', [username]);
      return res.status(401).json({ message: 'OTP tidak valid' });
    }

    // Update last login + simpan login attempt sukses
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);

    // Optionally: bersihkan failed attempts older untuk kenyamanan (tidak wajib)
    try {
      await pool.query('DELETE FROM login_attempts WHERE username = ? AND success = 0', [username]);
    } catch (e) {
      // ignore if delete fails
      console.warn('Could not delete failed attempts:', e && e.message);
    }

    // Set cookie cross-site (httpOnly). Pastikan sameSite:none + secure:true di production
    setCookie({ res }, 'userRole', String(user.role || 'user'), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 30 * 60, // 30 menit
    });

    setCookie({ res }, 'userName', String(user.username || ''), {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  path: '/',
  maxAge: 30 * 60,
});


    // Kembalikan role juga agar frontend bisa langsung set UI (opsional)
    return res.status(200).json({ message: 'Login berhasil', role: user.role || 'user' });
    

  } catch (error) {
    console.error('❌ API Login Error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan' });
  }
}
