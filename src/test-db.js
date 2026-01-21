// test-db.js (lokal)
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 25760),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 1,
  });
  try {
    const [r] = await pool.query('SELECT 1+1 as v');
    console.log('OK', r);
  } catch (e) {
    console.error('ERR', e);
  } finally {
    await pool.end();
  }
}

main();
