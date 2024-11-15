import { Router } from 'express';
import { getEncuestas, createEncuesta, getEncuestasByCita, generatePDFAndSave } from '../controllers/encuestaController.js';
import path from 'path';

const router = Router();

// Ruta para obtener todas las encuestas
router.get('/', getEncuestas);  
// Ruta para crear una nueva encuesta
router.post('/crearencuesta', createEncuesta);  
// Ruta para obtener encuestas por id_cita
router.get('/:cita_id', getEncuestasByCita); 

router.post('/generate-pdf/:cita_id', generatePDFAndSave);

// Nueva ruta para servir el PDF
router.get('/pdf/:id_cita', (req, res) => {
    const { id_cita } = req.params;
    const pdfPath = path.join(__dirname, '../src/pdfs/reporte_' + id_cita + '.pdf'); 

    res.sendFile(pdfPath, (err) => {
        if (err) {
            console.error('Error al enviar el PDF:', err);
            res.status(err.status).end();
        } else {
            console.log('PDF enviado:', pdfPath);
        }
    });
});

export default router;
