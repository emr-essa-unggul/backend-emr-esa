// // src/lib/db.js
// import mysql from 'mysql2/promise';

// const {
//   DB_HOST = 'localhost',
//   DB_USER = 'root',
//   DB_PASS = 'Bekasibarat12',
//   DB_NAME = 'emr_db',
//   DB_CONN_LIMIT = 10,
// } = process.env;

// let cached = globalThis._mysqlPool; // reuse across invocations (serverless-friendly)

// export function getPool() {
//   if (!cached) {
//     cached = {};
//     cached.pool = mysql.createPool({
//       host: DB_HOST,
//       user: DB_USER,
//       password: DB_PASS,
//       database: DB_NAME,
//       waitForConnections: true,
//       connectionLimit: Number(DB_CONN_LIMIT) || 10,
//       queueLimit: 0,
//     });
//     // store back to global so future invocations reuse
//     globalThis._mysqlPool = cached;
//   }
//   return cached.pool;
// }


import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
    });
  }
  return pool;
}
