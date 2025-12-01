// // src/pages/api/reset-auto.js
// import { getPool } from '@/lib/db';
// import bcrypt from 'bcryptjs';

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

// function looksLikeBcryptHash(s) {
//   if (!s || typeof s !== 'string') return false;
//   return /^\$2[aby]\$\d{2}\$.{53}$/.test(s);
// }

// export default async function handler(req, res) {
//   try {
//     applyCors(req, res);

//     if (req.method === 'OPTIONS') return res.status(200).end();
//     if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

//     const { username, passwordPrev, hashPrev, otpPrev, newPassword } = req.body || {};

//     if (!username || (!passwordPrev && !hashPrev) || !otpPrev || !newPassword) {
//       return res.status(400).json({ message: 'Harap isi semua field yang dibutuhkan' });
//     }

//     const pool = getPool();
//     if (!pool) return res.status(500).json({ message: 'DB connection error' });

//     // ambil user
//     const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
//     if (!Array.isArray(users) || users.length === 0) {
//       return res.status(404).json({ message: 'Username tidak ditemukan' });
//     }
//     const user = users[0];
//     const storedPassword = user.password ?? '';
//     const storedOtp = user.otp_secret ?? user.otp ?? null;

//     // verifikasi OTP lama
//     if (!storedOtp || String(storedOtp) !== String(otpPrev)) {
//       return res.status(401).json({ message: 'OTP lama tidak valid' });
//     }

//     // verifikasi password lama:
//     let verifiedPrev = false;
//     // prefer hashPrev if diberikan
//     const candidateHash = hashPrev && looksLikeBcryptHash(hashPrev) ? hashPrev : (passwordPrev && looksLikeBcryptHash(passwordPrev) ? passwordPrev : null);

//     try {
//       if (candidateHash) {
//         // jika user memberikan hash, bandingkan langsung dengan stored hash
//         verifiedPrev = candidateHash === storedPassword;
//       } else {
//         // bandingkan plain password terhadap stored hashed password
//         verifiedPrev = await bcrypt.compare(String(passwordPrev).trim(), String(storedPassword));
//       }
//     } catch (err) {
//       // fallback: bandingkan literal (legacy)
//       verifiedPrev = String(passwordPrev).trim() === String(storedPassword) || String(hashPrev).trim() === String(storedPassword);
//     }

//     if (!verifiedPrev) {
//       return res.status(401).json({ message: 'Password lama / Hash lama tidak sesuai' });
//     }

//     // validasi newPassword menggunakan policy sama seperti register
//     const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
//     if (!policy.test(newPassword)) {
//       return res.status(400).json({ message: 'Password baru tidak memenuhi ketentuan keamanan' });
//     }

//     // generate new OTP (jika ingin backend yang membuatnya)
//     const newOtp = String(Math.floor(100000 + Math.random() * 900000));

//     // hash password baru
//     const newHashed = await bcrypt.hash(String(newPassword).trim(), 10);

//     // update user
//     try {
//       await pool.query('UPDATE users SET password = ?, otp_secret = ? WHERE id = ?', [newHashed, newOtp, user.id]);
//     } catch (sqlErr) {
//       console.error('SQL UPDATE error (reset-auto):', sqlErr && sqlErr.message);
//       return res.status(500).json({ message: 'DB update error', detail: sqlErr && sqlErr.message });
//     }

//     // log attempt sukses (optional)
//     try {
//       await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);
//     } catch (err) {
//       // ignore
//     }

//     return res.status(200).json({
//       message: 'Reset otomatis berhasil',
//       newOtp,
//       hashedPassword: newHashed,
//     });

//   } catch (error) {
//     console.error('❌ reset-auto error:', error);
//     return res.status(500).json({ message: 'Terjadi kesalahan internal' });
//   }
// }




// src/pages/api/reset-auto.js
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://emr-ueu.web.app',
  'https://emr-ueu.firebaseapp.com',
];

function applyCors(req, res) {
  const origin = req.headers.origin;
  res.setHeader('Vary', 'Origin');
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'https://emr-ueu.web.app');
    return;
  }
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function looksLikeBcryptHash(s) {
  if (!s || typeof s !== 'string') return false;
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(s);
}

export default async function handler(req, res) {
  try {
    applyCors(req, res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { username, passwordPrev, hashPrev, otpPrev, newPassword } = req.body || {};

    if (!username || (!passwordPrev && !hashPrev) || !otpPrev || !newPassword) {
      return res.status(400).json({ message: 'Harap isi semua field yang dibutuhkan' });
    }

    const pool = getPool();
    if (!pool) return res.status(500).json({ message: 'DB connection error' });

    // ambil user
    const [users] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ message: 'Username tidak ditemukan' });
    }
    const user = users[0];
    const storedPassword = user.password ?? '';
    const storedOtp = user.otp_secret ?? user.otp ?? null;

    // verifikasi OTP lama
    if (!storedOtp || String(storedOtp) !== String(otpPrev)) {
      return res.status(401).json({ message: 'OTP lama tidak valid' });
    }

    // verifikasi password lama:
    let verifiedPrev = false;
    // prefer hashPrev if diberikan
    const candidateHash = hashPrev && looksLikeBcryptHash(hashPrev) ? hashPrev : (passwordPrev && looksLikeBcryptHash(passwordPrev) ? passwordPrev : null);

    try {
      if (candidateHash) {
        // jika user memberikan hash, bandingkan langsung dengan stored hash
        verifiedPrev = candidateHash === storedPassword;
      } else {
        // bandingkan plain password terhadap stored hashed password
        verifiedPrev = await bcrypt.compare(String(passwordPrev).trim(), String(storedPassword));
      }
    } catch (err) {
      // fallback: bandingkan literal (legacy)
      verifiedPrev = String(passwordPrev).trim() === String(storedPassword) || String(hashPrev).trim() === String(storedPassword);
    }

    if (!verifiedPrev) {
      return res.status(401).json({ message: 'Password lama / Hash lama tidak sesuai' });
    }

    // validasi newPassword menggunakan policy sama seperti register
    const policy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
    if (!policy.test(newPassword)) {
      return res.status(400).json({ message: 'Password baru tidak memenuhi ketentuan keamanan' });
    }

    // generate new OTP (jika ingin backend yang membuatnya)
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));

    // hash password baru
    const newHashed = await bcrypt.hash(String(newPassword).trim(), 10);

    // update user
    try {
      await pool.query('UPDATE users SET password = ?, otp_secret = ? WHERE id = ?', [newHashed, newOtp, user.id]);
    } catch (sqlErr) {
      console.error('SQL UPDATE error (reset-auto):', sqlErr && sqlErr.message);
      return res.status(500).json({ message: 'DB update error', detail: sqlErr && sqlErr.message });
    }

    // hapus semua failed attempts supaya user tidak kena 429 setelah reset
    try {
      await pool.query('DELETE FROM login_attempts WHERE username = ? AND success = 0', [username]);
    } catch (delErr) {
      console.warn('Could not delete failed attempts after reset:', delErr && delErr.message);
    }

    // log attempt sukses (optional)
    try {
      await pool.query('INSERT INTO login_attempts (username, success, attempt_time) VALUES (?, 1, NOW())', [username]);
    } catch (err) {
      // ignore
    }

    return res.status(200).json({
      message: 'Reset otomatis berhasil',
      newOtp,
      hashedPassword: newHashed,
    });

  } catch (error) {
    console.error('❌ reset-auto error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan internal' });
  }
}
