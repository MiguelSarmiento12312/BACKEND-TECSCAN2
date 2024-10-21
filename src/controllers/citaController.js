// src/controllers/citaController.js
import { pool } from '../config/db.js';
import QRCode from 'qrcode'; // Para generar QR
import nodemailer from 'nodemailer'; // Para enviar correos
import dotenv from 'dotenv';
dotenv.config();

// Obtener todas las citas con el nombre del paciente
export const getCitas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, p.nombre AS nombre_paciente
            FROM citas c
            LEFT JOIN pacientes p ON c.id_paciente = p.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear una nueva cita y enviar correo con QR
export const createNewCita = async (req, res) => {
    const { pacienteId, fecha, hora } = req.body;

    try {
        // Verificar si el paciente existe y obtener su email
        const pacienteEmail = await getPacienteEmailById(pacienteId);
        if (!pacienteEmail) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        // Insertar la nueva cita en la base de datos
        const citaId = await insertCita(pacienteId, fecha, hora);

        // Generar y almacenar el QR en la base de datos
        const qrCode = await generarQRCode(citaId);
        await actualizarCitaConQR(citaId, qrCode);

        // Enviar correo al paciente con el QR
        await sendEmail(pacienteEmail, qrCode);

        res.status(201).json({ success: true, citaId, qrCode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Función para obtener el email del paciente por su ID
const getPacienteEmailById = async (pacienteId) => {
    const [rows] = await pool.query('SELECT email FROM pacientes WHERE id = ?', [pacienteId]);
    return rows.length > 0 ? rows[0].email : null;
};

// Función para insertar una cita
const insertCita = async (pacienteId, fecha, hora) => {
    const [result] = await pool.query('INSERT INTO citas (id_paciente, fecha, hora) VALUES (?, ?, ?)', [pacienteId, fecha, hora]);
    return result.insertId;
};

// Función para generar el código QR
const generarQRCode = async (citaId) => {
    const qrCodeData = `${citaId}`; // Genera el QR solo con el ID de la cita
    return await QRCode.toDataURL(qrCodeData);
};

// Función para actualizar la cita con el código QR
const actualizarCitaConQR = async (citaId, qrCode) => {
    await pool.query('UPDATE citas SET qr_code = ? WHERE id = ?', [qrCode, citaId]);
};

// Enviar el correo electrónico con el código QR
const sendEmail = async (email, qrCode) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'sdepaul936@gmail.com',
        to: email,
        subject: 'Confirmación de Cita',
        html: `<h1>Su cita ha sido confirmada</h1><img src="${qrCode}" alt="Código QR" />`,
    };

    await transporter.sendMail(mailOptions);
};

// Obtener una cita por ID con información del paciente
export const getCitaById = async (req, res) => {
    const { id } = req.params;
    try {
        // Consulta para obtener la cita y la información del paciente relacionado
        const [rows] = await pool.query(`
            SELECT c.*, p.nombre, p.dni, p.email, p.direccion, p.fecha_nacimiento, p.estado_civil, p.ocupacion
            FROM citas c
            LEFT JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        // Devolver la cita con la información del paciente
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Función para obtener el id del paciente por su DNI
export const getPacienteIdByDni = async (dni) => {
    const [rows] = await pool.query('SELECT id FROM pacientes WHERE dni = ?', [dni]);
    return rows.length > 0 ? rows[0].id : null;
};

// Función para obtener las citas por el id del paciente
export const getCitasByPacienteId = async (pacienteId) => {
    const [rows] = await pool.query('SELECT * FROM citas WHERE id_paciente = ?', [pacienteId]);
    return rows;
};

// Manejar el escaneo del DNI
export const handleDniScan = async (req, res) => {
    const { dniEscaneado } = req.body; // Suponiendo que el DNI escaneado se envía en el cuerpo de la solicitud

    try {
        const pacienteId = await getPacienteIdByDni(dniEscaneado);
        if (!pacienteId) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const citas = await getCitasByPacienteId(pacienteId);
        if (citas.length === 0) {
            return res.status(404).json({ message: 'No hay citas encontradas para este paciente' });
        }

        res.json(citas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
