import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { pool } from '../config/db.js'; // Asegúrate de que estás importando correctamente tu pool de conexión

// Función para crear un nuevo detalle de encuesta
export const createDetail = async (req, res) => {
  const {
    id_cita,
    nivel_salud,
    comentarios,
    presion_arterial_sistolica,
    presion_arterial_diastolica,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    peso,
    altura,
    imc,
    diagnostico,
    tratamiento,
    nivel_dolor,
    alergias,
    medicamentos_actuales
  } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO detalles_encuesta 
      (id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales]);

    res.status(201).json({ message: 'Detalle de encuesta creado', id: result.insertId });
  } catch (error) {
    console.error('Error al crear el detalle de encuesta:', error);
    res.status(500).json({ message: 'Error al crear el detalle de encuesta' });
  }
};

// Función para actualizar un detalle de encuesta existente
export const updateDetail = async (req, res) => {
  const {
    id_cita,
    nivel_salud,
    comentarios,
    presion_arterial_sistolica,
    presion_arterial_diastolica,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    peso,
    altura,
    imc,
    diagnostico,
    tratamiento,
    nivel_dolor,
    alergias,
    medicamentos_actuales
  } = req.body;
  const { id } = req.params;

  try {
    await pool.query(`
      UPDATE detalles_encuesta SET 
      id_cita = ?, nivel_salud = ?, comentarios = ?, presion_arterial_sistolica = ?, presion_arterial_diastolica = ?, frecuencia_cardiaca = ?, frecuencia_respiratoria = ?, peso = ?, altura = ?, imc = ?, diagnostico = ?, tratamiento = ?, nivel_dolor = ?, alergias = ?, medicamentos_actuales = ?
      WHERE id = ?
    `, [id_cita, nivel_salud, comentarios, presion_arterial_sistolica, presion_arterial_diastolica, frecuencia_cardiaca, frecuencia_respiratoria, peso, altura, imc, diagnostico, tratamiento, nivel_dolor, alergias, medicamentos_actuales, id]);

    res.status(200).json({ message: 'Detalle de encuesta actualizado' });
  } catch (error) {
    console.error('Error al actualizar el detalle de encuesta:', error);
    res.status(500).json({ message: 'Error al actualizar el detalle de encuesta' });
  }
};

// Función para guardar un reporte con PDF como LONGBLOB
export const saveReport = async (id_cita, id_detalles_encuesta, pdfPath) => {
  try {
    // Leer el archivo PDF como Buffer
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Insertar en la base de datos
    const query = `
      INSERT INTO reportes (id_cita, id_detalles_encuesta, pdf_blob)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(query, [id_cita, id_detalles_encuesta, pdfBuffer]);

    return result.insertId; // Devuelve el ID del reporte insertado si es necesario
  } catch (error) {
    throw new Error(`Error al guardar el reporte: ${error.message}`);
  }
};

// Función para obtener un detalle de encuesta por ID
export const getDetail = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.query('SELECT * FROM detalles_encuesta WHERE id = ?', [id]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Detalle de encuesta no encontrado' });
      }
  
      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error al obtener el detalle de encuesta:', error);
      res.status(500).json({ message: 'Error al obtener el detalle de encuesta' });
    }
  };
  
// Función para generar un PDF y guardarlo como LONGBLOB en la base de datos
export const generatePDFAndSave = async (id_cita, id_detalles_encuesta) => {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, '..', 'pdfs', `reporte_${id_cita}.pdf`);

  doc.pipe(fs.createWriteStream(pdfPath));
  
  // Generar contenido del PDF
  doc.text(`Reporte para Cita ID: ${id_cita}`);
  doc.text(`Detalles de Encuesta ID: ${id_detalles_encuesta}`);
  // Agregar más contenido según sea necesario

  doc.end();

  try {
    // Guardar el PDF como LONGBLOB en la base de datos
    const reportId = await saveReport(id_cita, id_detalles_encuesta, pdfPath);
    console.log(`Reporte generado y guardado con ID: ${reportId}`);
    return reportId; // Opcional: puedes devolver el ID del reporte guardado
  } catch (error) {
    console.error(`Error al guardar el reporte en la base de datos: ${error.message}`);
    throw error;
  }
};
