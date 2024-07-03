import { pool } from '../config/db.js';

export const getCitas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM citas');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createCita = async (req, res) => {
    const { id_medico, id_paciente, fecha_cita, tipo_cita } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO citas (id_medico, id_paciente, fecha_cita, tipo_cita) VALUES (?, ?, ?, ?)', [id_medico, id_paciente, fecha_cita, tipo_cita]);
        
        // Obtener detalles de encuesta
        const [detallesEncuesta] = await pool.query('SELECT * FROM detalles_encuesta WHERE id_cita = ?', [result.insertId]);

        // Obtener nombre del paciente y nombre del médico
        const [infoCita] = await pool.query(`
            SELECT c.*, p.nombre AS nombre_paciente, m.nombre AS nombre_medico
            FROM citas c
            LEFT JOIN pacientes p ON c.id_paciente = p.id
            LEFT JOIN medicos m ON c.id_medico = m.id
            WHERE c.id = ?
        `, [result.insertId]);

        const { nombre_paciente, nombre_medico, tipo_cita } = infoCita;

        // Generar PDF
        const pdfPath = await generatePDF(result.insertId, detallesEncuesta.id, nombre_paciente, tipo_cita, nombre_medico, detallesEncuesta);

        res.json({ id: result.insertId, id_medico, id_paciente, fecha_cita, tipo_cita, pdfPath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getCitaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Cita no encontrada' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
