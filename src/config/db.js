import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  switch (err.code) {
    case 'PROTOCOL_CONNECTION_LOST':
      console.error('Database connection was closed.');
      break;
    case 'ER_CON_COUNT_ERROR':
      console.error('Database has too many connections.');
      break;
    case 'ECONNREFUSED':
      console.error('Database connection was refused.');
      break;
    default:
      console.error('Database error:', err.message);
  }
});

export { pool };
