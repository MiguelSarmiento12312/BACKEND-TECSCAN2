import { Router } from 'express';
import adminController from '../controllers/adminController.js';

const router = Router();

// Rutas de autenticación del administrador
router.post('/register', adminController.register); // Registrar un administrador
router.post('/login', adminController.login); // Inicio de sesión del administrador

// Rutas para Médicos
router.get('/medicos', adminController.getAllMedicos); // Obtener todos los médicos
router.get('/medicos/:id', adminController.getMedicoById); // Obtener un médico por ID
router.post('/medicos', adminController.createMedico); // Crear un médico
router.put('/medicos/:id', adminController.updateMedico); // Actualizar un médico por ID
router.delete('/medicos/:id', adminController.deleteMedico); // Eliminar un médico por ID

// Rutas para Pacientes
router.get('/pacientes', adminController.getAllPacientes);
router.get('/pacientes/:id', adminController.getPacienteById);
router.post('/pacientes', adminController.createNewPaciente);
router.put('/pacientes/:id', adminController.updatePaciente);
router.delete('/pacientes/:id', adminController.deletePaciente); // Ahora usando deletePaciente
router.delete('/pacientes', adminController.deleteManyPacientes); // Para eliminar múltiples pacientes

// Rutas para Citas
router.get('/citas', adminController.getAllCitas);             // Obtener todas las citas
router.get('/citas/:id', adminController.getCitaById);         // Obtener una cita por ID
router.post('/citas', adminController.createCita);             // Crear una nueva cita
router.put('/citas/:id', adminController.updateCita);          // Actualizar una cita por ID
router.delete('/citas/:id', adminController.deleteCita);       // Eliminar una cita por ID

// Rutas para Encuestas
router.get('/encuestas', adminController.getAllEncuestas); // Obtener todas las encuestas
router.get('/encuestas/:id', adminController.getEncuestaById); // Obtener una encuesta por ID
router.post('/encuestas', adminController.createEncuesta); // Crear una encuesta
router.put('/encuestas/:id', adminController.updateEncuesta); // Actualizar una encuesta por ID
router.delete('/encuestas/:id', adminController.deleteEncuesta); // Eliminar una encuesta por ID

// Rutas para Reportes
router.get('/reportes', adminController.getAllReportesPDF);
router.get('/reportes/:id', adminController.getReportePDFById);
router.post('/reportes', adminController.createReportePDF);
router.put('/reportes/:id', adminController.updateReportePDF);
router.delete('/reportes/:id', adminController.deleteReportePDF);

export default router;
