// src/routes/medicoRoutes.js
import express from 'express';
import { medicoController, registerValidator } from '../controllers/medicoController.js';

const router = express.Router();

// Ruta de registro con validación
router.post('/register', registerValidator, medicoController.register);

// Ruta de login
router.post('/login', medicoController.login);

// Ruta para obtener información de todos los médicos (sin autenticación)
router.get('/info', medicoController.getAllMedicos); // Cambiado para que devuelva todos los médicos

// Ruta para obtener todos los médicos
router.get('/', medicoController.getAllMedicos);

// Ruta para modificar la información de un médico
router.put('/:id', medicoController.updateMedico); // Actualización del médico

// Ruta para obtener un médico por su id
router.get('/:id', medicoController.getMedicoById);

export default router;
