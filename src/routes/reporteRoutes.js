import express from 'express';
import { createDetail, updateDetail, getDetail, getReportsByCita, generatePDFAndSave, getAllReports } from '../controllers/reporteController.js';

const router = express.Router();

// Ruta para obtener todos los reportes
router.get('/', getAllReports);

// Ruta para crear un nuevo detalle de encuesta
router.post('/details', createDetail);

// Ruta para actualizar un detalle de encuesta existente
router.put('/details/:id', updateDetail);

// Ruta para obtener un detalle de encuesta por ID
router.get('/details/:id', getDetail);

// Ruta para obtener reportes por id_cita
router.get('/reports/:id_cita', getReportsByCita);

// Ruta para generar un PDF y guardarlo
router.post('/generate-pdf', async (req, res) => {
  const { id_cita, id_detalles_encuesta } = req.body;
  try {
    const reportId = await generatePDFAndSave(id_cita, id_detalles_encuesta);
    res.status(200).json({ message: 'PDF generado y guardado', reportId });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar y guardar el PDF', error: error.message });
  }
});

export default router;
