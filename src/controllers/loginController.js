import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const loginController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Buscar al médico en la base de datos por su correo electrónico
      const [rows] = await pool.query('SELECT id, nombre, apellido, email, password FROM medicos WHERE email = ?', [email]);

      // Si no se encuentra ningún médico con el correo electrónico proporcionado, devolver un error de autenticación
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      // Obtener el primer médico encontrado (debería ser único debido a la restricción UNIQUE en la columna email)
      const medico = rows[0];

      // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(password, medico.password);

      // Depuración: Mostrar las contraseñas para verificar
      console.log('Contraseña proporcionada:', password);
      console.log('Contraseña almacenada:', medico.password);

      // Si las contraseñas no coinciden, devolver un error de autenticación
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      }

      // Generar un token de autenticación usando JWT
      const token = jwt.sign({ id: medico.id, email: medico.email }, process.env.JWT_SECRET, {
        expiresIn: '1h' // El token expira en 1 hora
      });

      // Devolver el token de autenticación y la información del médico como respuesta
      return res.status(200).json({ 
        success: true, 
        token,
        medico: {
          id: medico.id,
          nombre: medico.nombre,
          apellido: medico.apellido,
          email: medico.email
        }
      });
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      // Si hay un error durante el proceso de inicio de sesión, devolver un error de servidor
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  }
};

export default loginController;
