import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    // Si no hay token, permitir que la solicitud continúe sin autenticación
    req.medico = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM medicos WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.medico = rows[0]; // Almacena los datos del médico en req.medico
    next();
  } catch (error) {
    console.error('Error durante la autenticación:', error);
    return res.status(401).json({ success: false, message: 'Token no válido' });
  }
};

export default authMiddleware;
