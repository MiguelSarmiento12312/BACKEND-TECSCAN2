import { pool } from '../config/db.js';

const medicoController = {
  getMedicoInfo: async (req, res) => {
    try {
      const { id } = req.medico;

      const [rows] = await pool.query('SELECT id, nombre, apellido, email, password FROM medicos WHERE id = ?', [id]);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado' });
      }

      return res.status(200).json({ success: true, medico: rows[0] });
    } catch (error) {
      console.error('Error al obtener la información del médico:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  // Nueva función para obtener todos los médicos
  getAllMedicos: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, nombre, apellido, email, password FROM medicos');

      return res.status(200).json({ success: true, medicos: rows });
    } catch (error) {
      console.error('Error al obtener la lista de médicos:', error);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },
};

export default medicoController;
