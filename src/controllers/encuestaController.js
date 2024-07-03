// encuestaController.js

import { pool } from '../config/db.js';

export const getEncuestas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM detalles_encuesta');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener las encuestas:', err);
        res.status(500).json({ error: err.message });
    }
};

export const createEncuesta = async (req, res) => {
    const { id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO detalles_encuesta (id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales]);
        res.status(201).json({ id: result.insertId, id_cita, nivel_salud, comentarios });
    } catch (err) {
        console.error('Error al guardar los datos:', err);
        res.status(500).json({ error: err.message });
    }
};

// Función para obtener detalles de encuesta por id_cita
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
