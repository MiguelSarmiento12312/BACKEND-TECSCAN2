

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const adminController = {
  register: async (req, res) => {
    const { nombre, apellido, correo, password, telefono } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new administrator into the database
      const [result] = await pool.query(
        'INSERT INTO administradores (nombre, apellido, correo, password, telefono) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, correo, hashedPassword, telefono]
      );

      return res.status(201).json({ success: true, message: 'Administrador registrado con éxito', id: result.insertId });
    } catch (error) {
      console.error('Error al registrar el administrador:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  login: async (req, res) => {
    const { correo, password } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, apellido, correo, password, telefono FROM administradores WHERE correo = ?', 
        [correo]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      const admin = rows[0];
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: admin.id, correo: admin.correo }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.status(200).json({ 
        success: true, 
        token,
        admin: {
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          correo: admin.correo,
          telefono: admin.telefono
        }
      });
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  }
};

export default adminController;
