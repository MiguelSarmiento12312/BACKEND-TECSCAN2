//src/utils/pdfGenerator.js
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generatePDF = (
  id_cita,
  detallesEncuesta,
  nombre_paciente,
  tipo_cita,
  nombre_medico
) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const pdfPath = path.join(__dirname, '..', 'pdfs', `reporte_${id_cita}.pdf`);

      // Crear flujo de escritura para el PDF
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Generar el contenido del PDF
      doc.fontSize(20).text('Reporte de Cita', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`ID de Cita: ${id_cita}`);
      doc.text(`Nombre del Paciente: ${nombre_paciente}`);
      doc.text(`Nombre del Médico: ${nombre_medico}`);
      doc.text(`Tipo de Cita: ${tipo_cita}`);
      doc.moveDown();

      doc.text('Detalles de la Encuesta:');
      doc.text(`- Nivel de Salud: ${detallesEncuesta.nivel_salud}`);
      doc.text(`- Comentarios: ${detallesEncuesta.comentarios}`);
      doc.text(`- Presión Arterial Sistólica: ${detallesEncuesta.presion_arterial_sistolica}`);
      doc.text(`- Presión Arterial Diastólica: ${detallesEncuesta.presion_arterial_diastolica}`);
      doc.text(`- Frecuencia Cardíaca: ${detallesEncuesta.frecuencia_cardiaca}`);
      doc.text(`- Frecuencia Respiratoria: ${detallesEncuesta.frecuencia_respiratoria}`);
      doc.text(`- Peso: ${detallesEncuesta.peso}`);
      doc.text(`- Altura: ${detallesEncuesta.altura}`);
      doc.text(`- IMC: ${detallesEncuesta.imc}`);
      doc.text(`- Diagnóstico: ${detallesEncuesta.diagnostico}`);
      doc.text(`- Tratamiento: ${detallesEncuesta.tratamiento}`);
      doc.text(`- Nivel de Dolor: ${detallesEncuesta.nivel_dolor}`);
      doc.text(`- Alergias: ${detallesEncuesta.alergias}`);
      doc.text(`- Medicamentos Actuales: ${detallesEncuesta.medicamentos_actuales}`);

      doc.end();

      writeStream.on('finish', () => {
        resolve(pdfPath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
