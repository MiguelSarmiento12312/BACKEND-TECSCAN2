import express from 'express';
import {
    crearReporte,
    obtenerReportesPorCita,
    obtenerTodosLosReportes,
} from '../controllers/reporteController.js';

const router = express.Router();

// Ruta para crear un nuevo reporte
router.post('/crear-reporte', crearReporte);

// Ruta para obtener todos los reportes
router.get('/', obtenerTodosLosReportes);

// Ruta para obtener reportes por cita
router.get('/cita/:citaId', obtenerReportesPorCita);

export default router;
