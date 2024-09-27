import { pool } from '../config/db.js';
import pdfkit from 'pdfkit';
import fs from 'fs';

// Obtener todas las encuestas
export const getEncuestas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM detalles_encuesta');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener las encuestas:', err);
        res.status(500).json({ error: err.message });
    }
};

// Crear una nueva encuesta
export const createEncuesta = async (req, res) => {
    const { id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales } = req.body;

    // Validación básica de datos
    if (!id_cita || !nivel_salud || !presion_arterial_sistolica) {
        return res.status(400).json({ error: 'Los campos id_cita, nivel_salud y presion_arterial_sistolica son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO detalles_encuesta (id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales]
        );
        res.status(201).json({ id: result.insertId, id_cita, nivel_salud, comentarios });
    } catch (err) {
        console.error('Error al guardar los datos:', err);
        res.status(500).json({ error: err.message });
    }
};

// Obtener detalles de encuesta por id_cita
export const getEncuestasByCita = async (req, res) => {
    const { id_cita } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM detalles_encuesta WHERE id_cita = ?', [id_cita]);
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener las encuestas por id_cita:', err);
        res.status(500).json({ error: err.message });
    }
};

export const generatePDFAndSave = async (req, res) => {
    const { id_cita } = req.body; // Recibimos el ID de la cita desde el cuerpo de la solicitud

    try {
        // Obtener los detalles de la encuesta usando el id_cita
        const [rows] = await pool.query('SELECT * FROM detalles_encuesta WHERE id_cita = ?', [id_cita]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles de encuesta para esta cita' });
        }
        const details = rows[0];

        // Crear el PDF
        const pdfPath = `src/pdfs/reporte_${id_cita}.pdf`;
        const doc = new pdfkit({ margin: 0 }); // Sin márgenes para un informe completo
        doc.pipe(fs.createWriteStream(pdfPath));

        // Título del informe
        doc.fontSize(26).text('Informe Médico', { align: 'center' }).moveDown(1);

        // Información del paciente
        doc.fontSize(14).text('Información del Paciente:', { underline: true }).moveDown(0.5);
        doc.fontSize(12).text(`ID de Cita: ${id_cita}`);
        doc.text(`Nivel de Salud: ${details.nivel_salud}`);
        doc.moveDown(1); // Espacio entre secciones

        // Detalles de la encuesta
        doc.fontSize(14).text('Detalles de la Encuesta:', { underline: true }).moveDown(0.5);
        doc.fontSize(12).text(`Comentarios: ${details.comentarios}`);
        doc.text(`Presión Arterial Sistólica: ${details.presion_arterial_sistolica}`);
        doc.text(`Presión Arterial Diastólica: ${details.presion_arterial_diastolica}`);
        doc.text(`Frecuencia Cardiaca: ${details.frecuencia_cardiaca}`);
        doc.text(`Frecuencia Respiratoria: ${details.frecuencia_respiratoria}`);
        doc.text(`Peso: ${details.peso}`);
        doc.text(`Altura: ${details.altura}`);
        doc.text(`IMC: ${details.imc}`);
        doc.text(`Diagnóstico: ${details.diagnostico}`);
        doc.text(`Tratamiento: ${details.tratamiento}`);
        doc.text(`Nivel de Dolor: ${details.nivel_dolor}`);
        doc.text(`Alergias: ${details.alergias}`);
        doc.text(`Medicamentos Actuales: ${details.medicamentos_actuales}`);
        doc.moveDown(1); // Espacio entre secciones

        // Firmas
        doc.fontSize(14).text('Firma del Doctor:', { underline: true }).moveDown(0.5);
        doc.text('____________________'); // Línea para la firma
        doc.text('Dr. Nombre del Doctor'); // Puedes personalizar esto si tienes el nombre del doctor

        // Finaliza el PDF
        doc.end();

        res.status(200).json({ message: 'PDF generado y guardado', pdfPath });
    } catch (err) {
        console.error('Error al generar el PDF:', err);
        res.status(500).json({ error: err.message });
    }
};