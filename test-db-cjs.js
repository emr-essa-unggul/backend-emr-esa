// // test-db-cjs.js (letakkan di root: backend-emr-esa/test-db-cjs.js)
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// async function main() {
//   const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'switchyard.proxy.rlwy.net',
//     port: Number(process.env.DB_PORT || 25760),
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASS || process.env.MYSQL_ROOT_PASSWORD,
//     database: process.env.DB_NAME || 'railway',
//     connectionLimit: 1,
//   });

//   try {
//     const [rows] = await pool.query('SELECT NOW() AS now, 1+1 AS v');
//     console.log('DB test OK:', rows);
//   } catch (err) {
//     console.error('DB test ERROR:', err);
//   } finally {
//     try { await pool.end(); } catch(e) {}
//   }
// }

// main();



// test-db-cjs.js
const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// force load .env.local if exists, otherwise fallback to .env
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

console.log('Loaded env from:', envPath);
console.log('ENV CHECK', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASS_SET: !!(process.env.DB_PASS || process.env.MYSQL_ROOT_PASSWORD),
  USE_PASS_FROM: process.env.DB_PASS ? 'DB_PASS' : (process.env.MYSQL_ROOT_PASSWORD ? 'MYSQL_ROOT_PASSWORD' : 'none'),
});

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'switchyard.proxy.rlwy.net',
    port: Number(process.env.DB_PORT || 25760),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || process.env.MYSQL_ROOT_PASSWORD, // fallback
    database: process.env.DB_NAME || 'railway',
    connectionLimit: 1,
  });

  try {
    const [rows] = await pool.query('SELECT NOW() AS now, 1+1 AS v');
    console.log('DB test OK:', rows);
  } catch (err) {
    console.error('DB test ERROR:', err && err.message ? err.message : err);
    console.error(err);
  } finally {
    try { await pool.end(); } catch(e){}
  }
}

main();
