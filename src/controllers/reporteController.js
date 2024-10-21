import Reporte from '../models/Reporte.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { pool } from '../config/db.js';

// Crear un nuevo reporte
export const crearReporte = async (req, res) => {
    const { cita_id, ruta_pdf } = req.body;

    if (!cita_id || !ruta_pdf) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    try {
        // Aquí podrías querer realizar alguna lógica con cita_id y ruta_pdf
        const resultado = await pool.query('INSERT INTO reportes_pdf (cita_id, ruta_pdf) VALUES (?, ?)', [cita_id, ruta_pdf]);
        res.status(201).json({ message: 'Reporte creado con éxito', data: resultado });
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        res.status(500).json({ error: 'Error al crear el reporte' });
    }
};

// Obtener todos los reportes
export const obtenerTodosLosReportes = async (req, res) => {
    try {
        const reportes = await Reporte.findAll();
        res.status(200).json(reportes);
    } catch (error) {
        console.error('Error al obtener los reportes:', error); // Agregar un log para depuración
        res.status(500).json({ error: error.message });
    }
};

// Obtener reportes por cita
export const obtenerReportesPorCita = async (req, res) => {
    const { citaId } = req.params;

    try {
        const reportes = await Reporte.findAll({ where: { cita_id: citaId } });
        if (reportes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reportes para esta cita.' });
        }
        res.status(200).json(reportes);
    } catch (error) {
        console.error('Error al obtener reportes por cita:', error); // Agregar un log para depuración
        res.status(500).json({ error: error.message });
    }
};
