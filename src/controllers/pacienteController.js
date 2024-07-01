import { pool } from '../config/db.js';

export const getPacientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pacientes');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getPacienteByNumeroIdentificacion = async (req, res) => {
    const { numeroIdentificacion } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE numero_identificacion = ?', [numeroIdentificacion]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'Paciente no encontrado' });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};