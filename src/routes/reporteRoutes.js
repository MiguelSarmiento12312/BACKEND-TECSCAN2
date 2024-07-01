import express from 'express';
import { createDetail, updateDetail, getDetail } from '../controllers/reporteController.js';

const router = express.Router();

// Ruta para crear un nuevo detalle de encuesta
router.post('/details', createDetail);

// Ruta para actualizar un detalle de encuesta existente
router.put('/details/:id', updateDetail);

// Ruta para obtener un detalle de encuesta por ID
router.get('/details/:id', getDetail);

export default router;
