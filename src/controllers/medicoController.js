import { pool } from '../config/db.js';

const medicoController = {
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
};

export default medicoController;
