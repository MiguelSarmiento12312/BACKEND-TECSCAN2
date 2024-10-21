import express from 'express';
import {
  getPacientes,
  getPacienteById,
  createNewPaciente,
  updatePaciente,
  getIdCitaByIdPaciente
} from '../controllers/pacienteController.js';

const router = express.Router();

// Ruta para obtener todos los pacientes
router.get('/', getPacientes);

// Ruta para obtener un paciente por ID
router.get('/:id', getPacienteById);

// Ruta para crear un nuevo paciente
router.post('/', createNewPaciente);

// Ruta para actualizar un paciente por ID
router.put('/:id', updatePaciente);

// Ruta para obtener el ID de la cita asociada con un paciente por su ID
router.get('/:idPaciente/cita', getIdCitaByIdPaciente);

export default router;
