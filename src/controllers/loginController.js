import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const loginController = {
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

  changePassword: async (req, res) => {
    const { id } = req.user; // Asumiendo que el ID del médico está disponible en req.user después de la autenticación
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
  }
};

export default loginController;
