import express from 'express';
import medicoController from '../controllers/medicoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import loginController from '../controllers/loginController.js';
import { registerValidator, registerController } from '../controllers/registerController.js';

const router = express.Router();

// Ruta de registro con validación
router.post('/register', registerValidator, registerController.register);

// Ruta de login
router.post('/login', loginController.login);

// Ruta protegida que utiliza el middleware de autenticación
router.get('/info', authMiddleware, medicoController.getMedicoInfo);

// Ruta para obtener todos los médicos
router.get('/', medicoController.getAllMedicos);

export default router;
