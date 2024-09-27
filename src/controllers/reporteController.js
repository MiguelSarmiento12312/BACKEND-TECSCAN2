import { pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';

// Obtener todos los reportes (opcional)
export const getReportes = async (req, res) => {
    try {
        // Aquí puedes obtener información de los reportes si los estás guardando en la base de datos
        // Si solo guardas el archivo PDF, puedes cambiar esto a un listado de archivos
        const reportes = fs.readdirSync(path.join(__dirname, '../pdfs')); // Cambia la ruta según tu estructura
        res.json(reportes);
    } catch (err) {
        console.error('Error al obtener los reportes:', err);
        res.status(500).json({ error: err.message });
    }
};

// Guardar un reporte (si necesitas guardar información adicional relacionada al PDF)
export const saveReporte = async (req, res) => {
    const { id_cita, pdfPath } = req.body; // Suponiendo que envías el id_cita y la ruta del PDF

    // Lógica para guardar el reporte en la base de datos, si es necesario
    try {
        const [result] = await pool.query(
            'INSERT INTO reportes (id_cita, pdf_path) VALUES (?, ?)',
            [id_cita, pdfPath]
        );
        res.status(201).json({ message: 'Reporte guardado', id: result.insertId });
    } catch (err) {
        console.error('Error al guardar el reporte:', err);
        res.status(500).json({ error: err.message });
    }
};
