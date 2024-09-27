import { Router } from 'express';
import { getReportes, saveReporte } from '../controllers/reporteController.js';

const router = Router();

// Obtener todos los reportes
router.get('/', getReportes); // Opcional, si decides mantener un listado de PDFs

// Guardar un reporte
router.post('/', saveReporte); // Almacenar información del reporte generado

export default router;
