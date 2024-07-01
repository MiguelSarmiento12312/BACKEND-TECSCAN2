import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator';
import { pool } from '../config/db.js';

const registerValidator = [
  check('nombre').notEmpty().withMessage('El nombre es requerido'),
  check('apellido').notEmpty().withMessage('El apellido es requerido'),
  check('email').isEmail().withMessage('Debe ser un correo válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const registerController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nombre, apellido, email, password } = req.body;

    try {
      // Generar un hash para la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Guardar el médico en la base de datos con la contraseña encriptada
      const [result] = await pool.query(
        'INSERT INTO medicos (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
        [nombre, apellido, email, hashedPassword]
      );

      // Responder con éxito
      return res.status(201).json({ success: true, message: 'Registro exitoso', medicoId: result.insertId });
    } catch (error) {
      console.error('Error durante el registro:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  }
};

export { registerValidator, registerController };
