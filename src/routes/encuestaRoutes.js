// encuestaRoutes.js

import { Router } from 'express';
import { getEncuestas, createEncuesta, getEncuestasByCita } from '../controllers/encuestaController.js';

const router = Router();

router.get('/', getEncuestas);
router.post('/', createEncuesta);
router.get('/by-cita/:id_cita', getEncuestasByCita); // Nueva ruta para obtener detalles de encuesta por id_cita

export default router;
