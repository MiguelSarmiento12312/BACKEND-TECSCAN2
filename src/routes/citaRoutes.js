import { Router } from 'express';
import { getCitas, createCita } from '../controllers/citaController.js';

const router = Router();

router.get('/', getCitas);
router.post('/', createCita);

export default router;
