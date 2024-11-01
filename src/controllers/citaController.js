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
    const { id_paciente, fecha, hora } = req.body;

    try {
        // Verificar si el paciente existe y obtener su email
        const pacienteEmail = await getPacienteEmailById(id_paciente);
        if (!pacienteEmail) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        // Insertar la nueva cita en la base de datos
        const citaId = await insertCita(id_paciente, fecha, hora);

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
const getPacienteEmailById = async (id_paciente) => {
    const [rows] = await pool.query('SELECT email FROM pacientes WHERE id = ?', [id_paciente]);
    return rows.length > 0 ? rows[0].email : null;
};

// Función para insertar una cita
const insertCita = async (id_paciente, fecha, hora) => {
    const [result] = await pool.query('INSERT INTO citas (id_paciente, fecha, hora) VALUES (?, ?, ?)', [id_paciente, fecha, hora]);
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

// Obtener las citas por ID del médico
export const getCitasByMedicoId = async (req, res) => {
    const { id_medico } = req.params; // Obtener el id del médico de los parámetros de la solicitud
    try {
        const [rows] = await pool.query(`
            SELECT c.*, p.nombre AS nombre_paciente
            FROM citas c
            LEFT JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.id_medico = ?
        `, [id_medico]); // Usar id_medico en la consulta

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No hay citas encontradas para este médico' });
        }

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
export const getid_pacienteByDni = async (dni) => {
    const [rows] = await pool.query('SELECT id FROM pacientes WHERE dni = ?', [dni]);
    return rows.length > 0 ? rows[0].id : null;
};

// Función para obtener las citas por el id del paciente
export const getCitasByid_paciente = async (id_paciente) => {
    const [rows] = await pool.query('SELECT * FROM citas WHERE id_paciente = ?', [id_paciente]);
    return rows;
};

// Manejar el escaneo del DNI
export const handleDniScan = async (req, res) => {
    const { dniEscaneado } = req.body; // Suponiendo que el DNI escaneado se envía en el cuerpo de la solicitud

    try {
        const id_paciente = await getid_pacienteByDni(dniEscaneado);
        if (!id_paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const citas = await getCitasByid_paciente(id_paciente);
        if (citas.length === 0) {
            return res.status(404).json({ message: 'No hay citas encontradas para este paciente' });
        }

        res.json(citas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
