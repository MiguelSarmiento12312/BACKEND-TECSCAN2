import { pool } from '../config/db.js';

export const getEncuestas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM detalles_encuesta');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createEncuesta = async (req, res) => {
    const { id_cita, nivel_salud, comentarios } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO detalles_encuesta (id_cita, nivel_salud, comentarios) VALUES (?, ?, ?)', [id_cita, nivel_salud, comentarios]);
        res.json({ id: result.insertId, id_cita, nivel_salud, comentarios });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
