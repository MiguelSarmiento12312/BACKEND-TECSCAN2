import { pool } from '../config/db.js';

export const createPaciente = async (nombre, edad, genero, telefono, email) => {
  const numeroIdentificacion = generateRandomId(); // Generar el número de identificación aleatorio
  const query = 'INSERT INTO pacientes (nombre, edad, genero, telefono, email, numero_identificacion) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [nombre, edad, genero, telefono, email, numeroIdentificacion];
  const [result] = await pool.query(query, values);
  return {
    id: result.insertId,
    nombre,
    edad,
    genero,
    telefono,
    email,
    numero_identificacion: numeroIdentificacion,
  };
};

const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
