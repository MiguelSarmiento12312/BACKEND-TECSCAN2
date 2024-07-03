import express from 'express';
import { getPacientes, getPacienteByNumeroIdentificacion, createNewPaciente, getPacienteById } from '../controllers/pacienteController.js';
import { getIdCitaByIdPaciente } from '../controllers/pacienteController.js';

const router = express.Router();

// Ruta para obtener todos los pacientes
router.get('/', getPacientes);

// Ruta para obtener un paciente por su número de identificación
router.get('/numero/:numeroIdentificacion', getPacienteByNumeroIdentificacion);

// Ruta para obtener un paciente por su ID
router.get('/:id', getPacienteById);

// Ruta para crear un nuevo paciente
router.post('/', createNewPaciente);

router.get('/:idPaciente/cita', getIdCitaByIdPaciente);

export default router;
