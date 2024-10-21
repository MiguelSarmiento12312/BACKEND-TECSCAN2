import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DetallesEncuesta from '../models/DetallesEncuesta.js';
import Cita from '../models/Cita.js';
import Paciente from '../models/Paciente.js';


// Obtén el __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define los tipos de letra para el PDF usando Google Fonts
const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../../assets/fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../../assets/fonts/Roboto-Bold.ttf'),
        italics: path.join(__dirname, '../../assets/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../../assets/fonts/Roboto-BoldItalic.ttf'),
    },
};

const printer = new PdfPrinter(fonts);

// Función para crear el PDF
export const generatePDF = (details, cita_id) => {
    return new Promise((resolve, reject) => {
        console.log("Detalles recibidos:", details); // Registro de detalles

        const pdfDir = path.join(__dirname, '../pdfs'); // Directorio para los PDFs
        const pdfPath = path.join(pdfDir, 'reporte_' + cita_id + '.pdf');

        // Verificar si el directorio existe y crearlo si no
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir, { recursive: true });
        }

        // Definición del documento PDF
        const docDefinition = {
            content: [
                {
                    image: path.join(__dirname, '../../assets/images/Header2.png'),
                    width: 520,
                    alignment: 'center',
                    margin: [0, 0, 0, 0],
                },
                {
                    text: 'Año del Bicentenario',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 20, 0, 0],
                },
                {
                    text: 'Chaclacayo, 16 de agosto de 2024',
                    style: 'subheader',
                    alignment: 'center',
                },
                {
                    text: 'FICHA CLÍNICA PSICOLÓGICA',
                    style: 'title',
                    alignment: 'center',
                    margin: [0, 30, 0, 20],
                },
                {
                    text: 'I. DATOS GENERALES:',
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10],
                },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            ['Campo', 'Detalle'],
                            ['Nombre completo', details.paciente.nombre || 'N/A'],
                            ['Edad', calcularEdad(details.paciente.fecha_nacimiento) || 'N/A'],
                            ['Género', details.paciente.genero || 'N/A'], // Asegúrate de tener esta propiedad en tu modelo
                            ['Teléfono', details.paciente.telefono || 'N/A'],
                            ['Email', details.paciente.email || 'N/A'],
                            ['Dirección', details.paciente.direccion || 'N/A'],
                            ['Fecha de Nacimiento', details.paciente.fecha_nacimiento || 'N/A'],
                            ['Estado civil', details.paciente.estado_civil || 'N/A'],
                            ['Ocupación', details.paciente.ocupacion || 'N/A'],
                            ['Antecedentes médicos', details.paciente.antecedentes_medicos || 'N/A'],
                            ['Alergias', details.paciente.alergias || 'N/A'],
                            ['Grupo sanguíneo', details.paciente.grupo_sanguineo || 'N/A'],
                            ['Notas adicionales', details.paciente.notas_adicionales || 'N/A'],
                            ['DNI', details.paciente.dni || 'N/A'],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20],
                },
                {
                    text: 'II. DETALLES DE LA ENCUESTA:', // Nueva sección para detalles de la encuesta
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10],
                },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            ['Campo', 'Detalle'],
                            ['Tratamiento previo', details.tratamiento_previo || 'N/A'],
                            ['Medicamentos actuales', details.medicamentos_actuales || 'N/A'],
                            ['Condiciones médicas', details.condiciones_medicas || 'N/A'],
                            ['Estado emocional', details.estado_emocional || 'N/A'],
                            ['Síntomas emocionales', details.sintomas_emocionales || 'N/A'],
                            ['Nivel de estrés', details.nivel_estres || 'N/A'],
                            ['Relación familiar', details.relacion_familiar || 'N/A'],
                            ['Red de apoyo', details.red_apoyo || 'N/A'],
                            ['Situación laboral', details.situacion_laboral || 'N/A'],
                            ['Actividad física', details.actividad_fisica || 'N/A'],
                            ['Patrones de sueño', details.patrones_sueno || 'N/A'],
                            ['Alimentación', details.alimentacion || 'N/A'],
                            ['Objetivos de terapia', details.objetivos_terapia || 'N/A'],
                            ['Cambios deseados', details.cambios_deseados || 'N/A'],
                            ['Habilidades deseadas', details.habilidades_deseadas || 'N/A'],
                            ['Comentarios', details.comentarios || 'N/A'],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20],
                },
                {
                    text: 'III. MOTIVO DE CONSULTA:', // Agregar sección para motivo de consulta si es necesario
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10],
                },
                {
                    text: 'Motivo de consulta: ' + (details.motivo_consulta || 'N/A'),
                    style: 'text',
                    margin: [0, 0, 0, 20],
                },
                {
                    text: 'FIRMA DEL DOCTOR:',
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10],
                },
                {
                    text: '____________________',
                    margin: [0, 0, 0, 10],
                },
                {
                    text: 'Dr. Nombre del Doctor',
                    margin: [0, 0, 0, 20],
                },
                {
                    text: 'Policlínico San Vicente de Paúl - Chaclacayo | Tel: +51 123 456 789',
                    style: 'footer',
                    alignment: 'center',
                    margin: [0, 20, 0, 0],
                },
            ],
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    color: '#000080',
                },
                subheader: {
                    fontSize: 10,
                    italics: true,
                    color: '#333',
                },
                title: {
                    fontSize: 26,
                    bold: true,
                    color: '#000080',
                },
                sectionHeader: {
                    fontSize: 14,
                    bold: true,
                    decoration: 'underline',
                    color: '#000080',
                },
                text: {
                    fontSize: 12,
                    margin: [0, 2, 0, 2],
                },
                footer: {
                    fontSize: 10,
                    alignment: 'center',
                    margin: [0, 10, 0, 0],
                },
            },
        };

        // Generar el PDF
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const writeStream = fs.createWriteStream(pdfPath);
        pdfDoc.pipe(writeStream);

        writeStream.on('finish', () => {
            console.log("PDF generado exitosamente:", pdfPath);
            resolve(pdfPath);
        });

        writeStream.on('error', (error) => {
            console.error("Error en el flujo de escritura:", error);
            reject(error);
        });

        pdfDoc.end();
    });
};


// Función para calcular la edad
const calcularEdad = (fechaNacimiento) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

// Controlador para generar el PDF y guardar la ruta
export const generatePDFAndSave = async (req, res) => {
    const { cita_id } = req.params;

    if (!cita_id) {
        return res.status(400).json({ error: 'cita_id es obligatorio.' });
    }

    try {
        // Obtener detalles de la encuesta
        const detallesEncuesta = await DetallesEncuesta.findAll({ where: { cita_id } });

        if (detallesEncuesta.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles de encuesta para esta cita.' });
        }

        // Obtener información de la cita incluyendo el paciente
        const cita = await Cita.findOne({
            where: { id: cita_id },
            include: [{ model: Paciente, as: 'paciente' }]
        });

        if (!cita || !cita.paciente) {
            return res.status(404).json({ error: 'No se encontró información del paciente para esta cita.' });
        }

        // Combina detalles de la encuesta con datos del paciente
        const details = { ...detallesEncuesta[0].dataValues, paciente: cita.paciente.dataValues };
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
