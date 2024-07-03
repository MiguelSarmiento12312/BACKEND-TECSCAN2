// controllers/pacienteController.js

import { pool } from '../config/db.js';

export const getIdCitaByIdPaciente = async (idPaciente) => {
  try {
    // Consulta SQL para obtener id_cita por id_paciente
    const query = `
      SELECT id_cita
      FROM citas
      WHERE id_paciente = ?
      ORDER BY id_cita DESC
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [idPaciente]);
    if (rows.length === 0) {
      throw new Error('No se encontró ninguna cita para el paciente');
    }
    return rows[0].id_cita;
  } catch (error) {
    throw new Error(`Error al obtener id_cita: ${error.message}`);
  }
};
