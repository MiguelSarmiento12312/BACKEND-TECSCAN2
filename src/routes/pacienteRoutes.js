import express from 'express';
import { getPacientes, getPacienteByNumeroIdentificacion } from '../controllers/pacienteController.js';

const router = express.Router();

// Ruta para obtener todos los pacientes
router.get('/', getPacientes);

// Ruta para obtener un paciente por su número de identificación
router.get('/:numeroIdentificacion', getPacienteByNumeroIdentificacion);

export default router;
