// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM medicos WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.medico = rows[0];
    next();
  } catch (error) {
    console.error('Error durante la autenticación:', error);
    return res.status(401).json({ success: false, message: 'Token no válido' });
  }
};

export default authMiddleware;
