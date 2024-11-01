import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { pool } from '../config/db.js';

const medicoController = {
  // Obtener todos los médicos
  getAllMedicos: async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, apellido, email, especialidad, telefono FROM medicos'
      );
      return res.status(200).json({ success: true, medicos: rows });
    } catch (error) {
      console.error('Error al obtener la lista de médicos:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  // Iniciar sesión para médicos
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, apellido, email, password, especialidad, telefono FROM medicos WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      const medico = rows[0];
      const passwordMatch = await bcrypt.compare(password, medico.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: medico.id, email: medico.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.status(200).json({
        success: true,
        token,
        medico: {
          id: medico.id,
          nombre: medico.nombre,
          apellido: medico.apellido,
          email: medico.email,
          especialidad: medico.especialidad,
          telefono: medico.telefono
        }
      });
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },
  
  // Cambiar la contraseña del médico
  changePassword: async (req, res) => {
    const { id } = req.user; // Asegúrate de que el middleware de autenticación esté configurado
    const { currentPassword, newPassword } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT password FROM medicos WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado' });
      }

      const medico = rows[0];
      const passwordMatch = await bcrypt.compare(currentPassword, medico.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      await pool.query(
        'UPDATE medicos SET password = ? WHERE id = ?',
        [hashedNewPassword, id]
      );

      return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  // Registrar nuevo médico
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nombre, apellido, email, password, especialidad, telefono } = req.body;

    try {
      // Verificar si el email ya está registrado
      const [existingRows] = await pool.query(
        'SELECT id FROM medicos WHERE email = ?',
        [email]
      );
      if (existingRows.length > 0) {
        return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
      }

      // Generar un hash para la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Guardar el médico en la base de datos con la contraseña encriptada
      const [result] = await pool.query(
        'INSERT INTO medicos (nombre, apellido, email, password, especialidad, telefono) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, hashedPassword, especialidad, telefono] // Agregando especialidad y telefono
      );

      // Responder con éxito
      return res.status(201).json({ success: true, message: 'Registro exitoso', id_medico: result.insertId });
    } catch (error) {
      console.error('Error durante el registro:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  // Actualizar información del médico
  updateMedico: async (req, res) => {
    const { id } = req.params; // ID del médico a actualizar
    const { nombre, especialidad, email, telefono } = req.body; // Agregando telefono

    // Validación básica
    if (!nombre || !especialidad || !email) {
      return res.status(400).json({ error: 'Los campos nombre, especialidad y email son obligatorios.' });
    }

    try {
      const [result] = await pool.query(
        'UPDATE medicos SET nombre = ?, especialidad = ?, email = ?, telefono = ? WHERE id = ?',
        [nombre, especialidad, email, telefono, id] // Agregando telefono
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Médico no encontrado.' });
      }

      res.json({ message: 'Información del médico actualizada correctamente.' });
    } catch (err) {
      console.error('Error al actualizar el médico:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

// Validador para actualizar el médico
const updateValidator = [
  check('nombre').notEmpty().withMessage('El nombre es requerido'),
  check('especialidad').notEmpty().withMessage('La especialidad es requerida'),
  check('email').isEmail().withMessage('Debe ser un correo válido'),
  check('telefono').optional().isNumeric().withMessage('El teléfono debe ser un número'), // Validación opcional para teléfono
  check('newPassword').optional().isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres') // Validación opcional para nueva contraseña
];

// Validador de datos para el registro
const registerValidator = [
  check('nombre').notEmpty().withMessage('El nombre es requerido'),
  check('apellido').notEmpty().withMessage('El apellido es requerido'),
  check('email').isEmail().withMessage('Debe ser un correo válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('especialidad').notEmpty().withMessage('La especialidad es requerida'), // Validación para especialidad
  check('telefono').optional().isNumeric().withMessage('El teléfono debe ser un número') // Validación opcional para teléfono
];

export { medicoController, registerValidator };
