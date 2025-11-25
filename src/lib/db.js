// src/lib/db.js
import mysql from 'mysql2/promise';

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASS = 'Bekasibarat12',
  DB_NAME = 'emr_db',
  DB_CONN_LIMIT = 10,
} = process.env;

let cached = globalThis._mysqlPool; // reuse across invocations (serverless-friendly)

export function getPool() {
  if (!cached) {
    cached = {};
    cached.pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: Number(DB_CONN_LIMIT) || 10,
      queueLimit: 0,
    });
    // store back to global so future invocations reuse
    globalThis._mysqlPool = cached;
  }
  return cached.pool;
}
