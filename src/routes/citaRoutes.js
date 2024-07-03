import { Router } from 'express';
import { getCitas, createCita, getCitaById } from '../controllers/citaController.js'; // Importa la función getCitaById

const router = Router();

router.get('/', getCitas);
router.post('/', createCita);
router.get('/:id', getCitaById); // Ruta para obtener una cita por ID

export default router;
