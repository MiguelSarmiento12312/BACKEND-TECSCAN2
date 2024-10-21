import { Sequelize } from 'sequelize'; // Importar Sequelize
import mysql from 'mysql2/promise'; // Importar mysql2/promise
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

// Crear una instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql', // Puedes usar 'mariadb' si es necesario
});

// Probar la conexión de Sequelize
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito (Sequelize).');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos (Sequelize):', error);
  }
};

testConnection();

// Crear un pool de conexiones para consultas fuera de Sequelize
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

// Probar la conexión del pool
pool.on('connection', () => {
  console.log('Conexión a la base de datos establecida con éxito (Pool).');
});

pool.on('error', (err) => {
  switch (err.code) {
    case 'PROTOCOL_CONNECTION_LOST':
      console.error('Conexión a la base de datos cerrada.');
      break;
    case 'ER_CON_COUNT_ERROR':
      console.error('La base de datos tiene demasiadas conexiones.');
      break;
    case 'ECONNREFUSED':
      console.error('Conexión a la base de datos rechazada.');
      break;
    default:
      console.error('Error de base de datos:', err.message);
  }
});

// Exportar sequelize y pool
export { sequelize, pool }; // Asegúrate de que ambas variables están siendo exportadas
