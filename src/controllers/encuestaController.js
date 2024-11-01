import DetallesEncuesta from '../models/DetallesEncuesta.js'; // Asegúrate de importar tu modelo
import { generatePDF } from '../utils/pdfGenerator.js'; // Asegúrate de que la ruta sea correcta
import axios from 'axios'; // Asegúrate de tener axios instalado
import Cita from '../models/Cita.js'; // Asegúrate de tener un modelo para la tabla 'citas'
import Paciente from '../models/Paciente.js'; // Asegúrate de tener un modelo para la tabla 'pacientes'
// Obtener todas las encuestas
export const getEncuestas = async (req, res) => {
    try {
        const encuestas = await DetallesEncuesta.findAll();
        res.json(encuestas);
    } catch (err) {
        console.error('Error al obtener las encuestas:', err);
        res.status(500).json({ error: err.message });
    }
};

// Crear una nueva encuesta
export const createEncuesta = async (req, res) => {
    const { 
        cita_id, 
        tratamiento_previo, 
        medicamentos_actuales, 
        condiciones_medicas, 
        estado_emocional, 
        sintomas_emocionales, 
        nivel_estres, 
        relacion_familiar, 
        red_apoyo, 
        situacion_laboral, 
        actividad_fisica, 
        patrones_sueno, 
        alimentacion, 
        objetivos_terapia, 
        cambios_deseados, 
        habilidades_deseadas, 
        comentarios,
        motivo_consulta  
    } = req.body;

    // Validación básica de datos
    if (!cita_id) {
        return res.status(400).json({ error: 'El campo cita_id es obligatorio.' });
    }

    try {
        const nuevaEncuesta = await DetallesEncuesta.create({
            cita_id,
            tratamiento_previo,
            medicamentos_actuales,
            condiciones_medicas,
            estado_emocional,
            sintomas_emocionales,
            nivel_estres,
            relacion_familiar,
            red_apoyo,
            situacion_laboral,
            actividad_fisica,
            patrones_sueno,
            alimentacion,
            objetivos_terapia,
            cambios_deseados,
            habilidades_deseadas,
            comentarios,
            motivo_consulta 
        });
        res.status(201).json(nuevaEncuesta);
    } catch (err) {
        console.error('Error al guardar los datos:', err);
        res.status(500).json({ error: err.message });
    }
};

// Obtener encuestas por cita_id
export const getEncuestasByCita = async (req, res) => {
    const { cita_id } = req.params;

    try {
        const encuestas = await DetallesEncuesta.findAll({ where: { cita_id } });

        if (encuestas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron encuestas para esta cita.' });
        }

        res.json(encuestas);
    } catch (err) {
        console.error('Error al obtener las encuestas por cita:', err);
        res.status(500).json({ error: err.message });
    }
};

// Controlador para generar el PDF y guardar la ruta
export const generatePDFAndSave = async (req, res) => {
    const { cita_id } = req.params;

    if (!cita_id) {
        return res.status(400).json({ error: 'cita_id es obligatorio.' });
    }

    try {
        // Obtener detalles de la encuesta
        const detallesEncuesta = await DetallesEncuesta.findOne({ where: { cita_id } }); // Cambiar a findOne

        if (!detallesEncuesta) {
            return res.status(404).json({ error: 'No se encontraron detalles de encuesta para esta cita.' });
        }

        // Obtener información de la cita incluyendo el paciente
        const cita = await Cita.findOne({
            where: { id: cita_id },
            include: [{ model: Paciente, as: 'paciente' }] // El alias debe coincidir con el definido en el modelo
        });

        if (!cita || !cita.paciente) {
            return res.status(404).json({ error: 'No se encontró información del paciente para esta cita.' });
        }

        // Combina detalles de la encuesta con datos del paciente
        const details = { 
            ...detallesEncuesta.dataValues, // Aquí tomamos los detalles de la encuesta directamente
            paciente: cita.paciente.dataValues 
        };

        const pdfPath = await generatePDF(details, cita_id);

        // Guardar la ruta del PDF en la tabla 'reportes_pdf'
        try {
            const response = await axios.post('http://localhost:3000/reportes/crear-reporte', {
                cita_id: cita_id,
                ruta_pdf: `/pdf/reporte_${cita_id}.pdf`,
            });

            console.log('Reporte guardado en la base de datos:', response.data);
            res.status(200).json({ message: 'PDF generado y ruta guardada', pdfPath });
        } catch (error) {
            console.error('Error al guardar el reporte en la base de datos:', error);
            res.status(500).json({ error: 'Error al guardar el reporte en la base de datos' });
        }
    } catch (err) {
        console.error('Error al generar el PDF:', err);
        res.status(500).json({ error: err.message });
    }
};
