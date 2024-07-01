import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { saveReport } from '../controllers/reporteController'; // Asegúrate de importar tu función para guardar el reporte

export const generatePDF = async (id_cita, id_detalles_encuesta) => {
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, '..', 'pdfs', `reporte_${id_cita}.pdf`);

    doc.pipe(fs.createWriteStream(pdfPath));
    
    // Generar contenido del PDF
    doc.text(`Reporte para Cita ID: ${id_cita}`);
    doc.text(`Detalles de Encuesta ID: ${id_detalles_encuesta}`);
    // Agregar más contenido según sea necesario

    doc.end();

    try {
        // Guardar el PDF como LONGBLOB en la base de datos
        const reportId = await saveReport(id_cita, id_detalles_encuesta, pdfPath);
        console.log(`Reporte generado y guardado con ID: ${reportId}`);
        return reportId; // Opcional: puedes devolver el ID del reporte guardado
    } catch (error) {
        console.error(`Error al guardar el reporte en la base de datos: ${error.message}`);
        throw error;
    }
};
