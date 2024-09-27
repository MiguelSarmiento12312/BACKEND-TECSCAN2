import express from 'express';
import medicoController from '../controllers/medicoController.js';
import loginController from '../controllers/loginController.js';
import { registerValidator, registerController } from '../controllers/registerController.js';

const router = express.Router();

// Ruta de registro con validación
router.post('/register', registerValidator, registerController.register);

// Ruta de login
router.post('/login', loginController.login);

// Ruta para obtener información de todos los médicos (sin autenticación)
router.get('/info', medicoController.getAllMedicos); // Cambiado para que devuelva todos los médicos

// Ruta para obtener todos los médicos
router.get('/', medicoController.getAllMedicos);

export default router;
