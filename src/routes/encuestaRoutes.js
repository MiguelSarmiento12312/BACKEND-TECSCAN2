import { Router } from 'express';
import { getEncuestas, createEncuesta } from '../controllers/encuestaController.js';

const router = Router();

router.get('/', getEncuestas);
router.post('/', createEncuesta);

export default router;
