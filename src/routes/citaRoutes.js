// src/routes/citaRoutes.js
import { Router } from 'express';
import { 
    getCitas, 
    createNewCita, 
    getCitaById, 
    handleDniScan,
    getCitasByMedicoId 
} from '../controllers/citaController.js';

const router = Router();

// Ruta para obtener todas las citas con la información básica del paciente
router.get('/', getCitas);

// Ruta para crear una nueva cita y generar el QR
router.post('/', createNewCita);

// Ruta para obtener una cita por su ID con la información del paciente relacionado
router.get('/:id', getCitaById);

// Nueva ruta para obtener citas por ID del médico
router.get('/medico/:id_medico', getCitasByMedicoId);

// Ruta para manejar el escaneo del DNI y obtener las citas del paciente
router.post('/scan-dni', handleDniScan);

export default router;
