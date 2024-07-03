// pacienteController.js

import { pool } from '../config/db.js';
import { createPaciente } from '../models/Paciente.js';
import { getIdCitaByIdPaciente as getIdCitaByPacienteId } from '../models/Cita.js'; // Renombrar la importación si es necesario

export const getPacientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPacienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Paciente no encontrado' });
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPacienteByNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE numero_identificacion = ?', [numeroIdentificacion]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Paciente no encontrado' });
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getIdCitaByIdPaciente = async (req, res) => {
  const { idPaciente } = req.params;
  try {
    // Lógica para obtener id_cita por id_paciente
    const idCita = await getIdCitaByPacienteId(idPaciente);
    res.json({ id_cita: idCita });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNewPaciente = async (req, res) => {
  const { nombre, edad, genero, telefono, email } = req.body;
  try {
    const paciente = await createPaciente(nombre, edad, genero, telefono, email);
    res.status(201).json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
