import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import DetallesEncuesta from '../models/DetallesEncuesta.js'; // Ajusta la ruta según tu estructura de carpetas
import Paciente from '../models/Paciente.js'; // Asegúrate de que la ruta al modelo es correcta

const adminController = {

  getAllReportesPDF: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM reportes_pdf');
      res.status(200).json({ success: true, reportes: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener reportes PDF' });
    }
  },

  getReportePDFById: async (req, res) => {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la solicitud
    try {
        const [rows] = await pool.query('SELECT * FROM reportes_pdf WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
        }
        res.status(200).json({ success: true, reporte: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el reporte PDF' });
    }
},

  createReportePDF: async (req, res) => {
    const { id_cita, nombre_archivo, fecha_creacion } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO reportes_pdf (id_cita, nombre_archivo, fecha_creacion) VALUES (?, ?, ?)',
        [id_cita, nombre_archivo, fecha_creacion]
      );
      res.status(201).json({ success: true, message: 'Reporte PDF creado con éxito', id: result.insertId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear reporte PDF' });
    }
  },

  updateReportePDF: async (req, res) => {
    const { id } = req.params;
    const { id_cita, nombre_archivo, fecha_creacion } = req.body;
    try {
      await pool.query(
        'UPDATE reportes_pdf SET id_cita = ?, nombre_archivo = ?, fecha_creacion = ? WHERE id = ?',
        [id_cita, nombre_archivo, fecha_creacion, id]
      );
      res.status(200).json({ success: true, message: 'Reporte PDF actualizado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al actualizar reporte PDF' });
    }
  },

  deleteReportePDF: async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM reportes_pdf WHERE id = ?', [id]);
      res.status(200).json({ success: true, message: 'Reporte PDF eliminado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar reporte PDF' });
    }
  },
  
  register: async (req, res) => {
    const { nombre, apellido, correo, password, telefono } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO administradores (nombre, apellido, correo, password, telefono) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, correo, hashedPassword, telefono]
      );
      return res.status(201).json({ success: true, message: 'Administrador registrado con éxito', id: result.insertId });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  login: async (req, res) => {
    const { correo, password } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT id, nombre, apellido, correo, password, telefono FROM administradores WHERE correo = ?', 
        [correo]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      const admin = rows[0];
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: admin.id, correo: admin.correo }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.status(200).json({ 
        success: true, 
        token,
        admin: {
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          correo: admin.correo,
          telefono: admin.telefono
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
  },

  getAllMedicos: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM medicos');
      res.status(200).json({ success: true, medicos: rows });
    } catch (error) {
      console.error('Error al obtener médicos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener médicos' });
    }
  },

  createMedico: async (req, res) => {
    const { nombre, especialidad, telefono } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO medicos (nombre, especialidad, telefono) VALUES (?, ?, ?)',
        [nombre, especialidad, telefono]
      );
      res.status(201).json({ success: true, message: 'Médico creado con éxito', id: result.insertId });
    } catch (error) {
      console.error('Error al crear médico:', error); // Para depuración
      res.status(500).json({ success: false, message: 'Error al crear médico' });
    }
  },

  updateMedico: async (req, res) => {
    const { id } = req.params;
    const { nombre, especialidad, telefono } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE medicos SET nombre = ?, especialidad = ?, telefono = ? WHERE id = ?',
        [nombre, especialidad, telefono, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado' });
      }

      res.status(200).json({ success: true, message: 'Médico actualizado' });
    } catch (error) {
      console.error('Error al actualizar médico:', error); // Para depuración
      res.status(500).json({ success: false, message: 'Error al actualizar médico' });
    }
  },

  getMedicoById: async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM medicos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Médico no encontrado' });
        }
        const medico = { id: rows[0].id, ...rows[0] }; 
        res.status(200).json({ success: true, medico });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener médico' });
    }
  },

  deleteMedico: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM medicos WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Médico no encontrado' });
      }

      res.status(200).json({ success: true, message: 'Médico eliminado' });
    } catch (error) {
      console.error('Error al eliminar médico:', error); // Para depuración
      res.status(500).json({ success: false, message: 'Error al eliminar médico' });
    }
  },

  getPacienteById: async (req, res) => {
    const { id } = req.params; // Obtiene el ID del paciente de los parámetros de la solicitud
    try {
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]); // Realiza la consulta a la base de datos
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' }); // Manejo del caso cuando no se encuentra el paciente
        }
        const paciente = { id: rows[0].id, ...rows[0] }; // Crea un objeto paciente con el ID y los datos del primer registro
        res.status(200).json({ success: true, paciente }); // Respuesta exitosa con los datos del paciente
    } catch (error) {
        console.error('Error al obtener paciente:', error); // Para depuración
        res.status(500).json({ success: false, message: 'Error al obtener paciente' }); // Manejo de errores en caso de fallo
    }
  },

  getAllPacientes: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM pacientes');
      res.status(200).json({ success: true, pacientes: rows });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener pacientes' });
    }
  },

  createNewPaciente: async (req, res) => {
    const {
      nombre,
      edad,
      genero,
      telefono,
      email,
      direccion,
      fecha_nacimiento,
      estado_civil,
      ocupacion,
      antecedentes_medicos,
      alergias,
      grupo_sanguineo,
      notas_adicionales,
      dni
    } = req.body;
  
    // Validación básica
    if (!nombre || !edad || !genero || !dni) {
      return res.status(400).json({ error: 'Los campos nombre, edad, genero y dni son obligatorios.' });
    }
  
    try {
      const nuevoPaciente = await Paciente.create({
        nombre,
        edad,
        genero,
        telefono,
        email,
        direccion,
        fecha_nacimiento,
        estado_civil,
        ocupacion,
        antecedentes_medicos,
        alergias,
        grupo_sanguineo,
        notas_adicionales,
        dni
      });
  
      return res.status(201).json({
        success: true,
        message: 'Paciente creado con éxito',
        id: nuevoPaciente.id, // Devuelve el ID del nuevo paciente
      });
    } catch (err) {
      console.error('Error al crear el paciente:', err);
      return res.status(500).json({ error: 'Error al crear paciente: ' + err.message });
    }
  },

  updatePaciente: async (req, res) => {
    const { id } = req.params;
    const {
        nombre, edad, genero, telefono, email, direccion,
        fecha_nacimiento, estado_civil, ocupacion,
        antecedentes_medicos, alergias, grupo_sanguineo,
        notas_adicionales, dni
    } = req.body;

    try {
        // Obtener el paciente existente
        const [paciente] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);

        if (paciente.length === 0) {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
        }

        // Crear un objeto con los nuevos valores, usando los existentes como fallback
        const updatedPaciente = {
            nombre: nombre !== undefined ? nombre : paciente[0].nombre,
            edad: edad !== undefined ? edad : paciente[0].edad,
            genero: genero !== undefined ? genero : paciente[0].genero,
            telefono: telefono !== undefined ? telefono : paciente[0].telefono,
            email: email !== undefined ? email : paciente[0].email,
            direccion: direccion !== undefined ? direccion : paciente[0].direccion,
            fecha_nacimiento: fecha_nacimiento !== undefined ? fecha_nacimiento : paciente[0].fecha_nacimiento,
            estado_civil: estado_civil !== undefined ? estado_civil : paciente[0].estado_civil,
            ocupacion: ocupacion !== undefined ? ocupacion : paciente[0].ocupacion,
            antecedentes_medicos: antecedentes_medicos !== undefined ? antecedentes_medicos : paciente[0].antecedentes_medicos,
            alergias: alergias !== undefined ? alergias : paciente[0].alergias,
            grupo_sanguineo: grupo_sanguineo !== undefined ? grupo_sanguineo : paciente[0].grupo_sanguineo,
            notas_adicionales: notas_adicionales !== undefined ? notas_adicionales : paciente[0].notas_adicionales,
            dni: dni !== undefined ? dni : paciente[0].dni,
        };

        // Actualizar el paciente solo si hay cambios
        const updateFields = Object.keys(updatedPaciente)
            .map(key => `${key} = ?`)
            .join(', ');

        const updateValues = Object.values(updatedPaciente).concat(id);

        await pool.query(
            `UPDATE pacientes SET ${updateFields} WHERE id = ?`,
            updateValues
        );

        res.status(200).json({ success: true, message: 'Paciente actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar paciente', error: error.message });
    }
},

  deleteManyPacientes: async (req, res) => {
    const { ids } = req.body; // Suponiendo que los IDs se envían en el cuerpo de la solicitud

    if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(Number(id)))) {
        return res.status(400).json({ success: false, message: 'IDs inválidos' });
    }

    try {
        // Comprobar si existen todos los pacientes
        const [results] = await pool.query('SELECT * FROM pacientes WHERE id IN (?)', [ids]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron pacientes' });
        }

        // Eliminar los pacientes
        await pool.query('DELETE FROM pacientes WHERE id IN (?)', [ids]);

        res.status(200).json({
            success: true,
            message: `${results.length} pacientes eliminados`
        });
    } catch (error) {
        console.error('Error al eliminar pacientes:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar pacientes', error: error.message });
    }
  },

  deletePaciente: async (req, res) => {
    const { id } = req.params;

    // Validar que el id es un número
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    try {
      // Comprobar si el paciente existe antes de eliminar
      const [result] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
      
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
      }

      // Eliminar el paciente
      await pool.query('DELETE FROM pacientes WHERE id = ?', [id]);
      res.status(200).json({ success: true, message: 'Paciente eliminado' });
    } catch (error) {
      console.error('Error al eliminar paciente:', error); // Log para depuración
      res.status(500).json({ success: false, message: 'Error al eliminar paciente', error: error.message });
    }
  },

  getAllCitas: async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                citas.id,
                citas.fecha,
                citas.hora,
                citas.estado,
                CONCAT(medicos.nombre, ' ', medicos.apellido) AS nombre_completo_medico,
                pacientes.nombre AS nombre_paciente,
                citas.id_medico,   -- Incluir id_medico en la respuesta
                citas.id_paciente   -- Incluir id_paciente en la respuesta
            FROM 
                citas
            JOIN 
                medicos ON citas.id_medico = medicos.id
            JOIN 
                pacientes ON citas.id_paciente = pacientes.id
        `);
        
        res.status(200).json({ success: true, citas: rows });
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ success: false, message: 'Error al obtener citas' });
    }
  },

  updateCita: async (req, res) => {
    const { id } = req.params;
    const { fecha, hora } = req.body; // No se permite modificar id_medico e id_paciente

    console.log(`Actualizando cita con ID: ${id}`);
    console.log(`Datos recibidos:`, req.body); // Verificar datos

    try {
        const [result] = await pool.query(
            'UPDATE citas SET fecha = ?, hora = ? WHERE id = ?',
            [fecha, hora, id] // Solo se actualizan fecha y hora
        );

        if (result.affectedRows === 0) {
            console.log(`Cita con ID: ${id} no encontrada`); // Log si no se encuentra
            return res.status(404).json({ success: false, message: 'Cita no encontrada' });
        }
        
        console.log(`Cita con ID: ${id} actualizada correctamente`); // Log de éxito
        res.status(200).json({ success: true, message: 'Cita actualizada' });
    } catch (error) {
        console.error(`Error al actualizar la cita con id ${id}:`, error);
        res.status(500).json({ success: false, message: 'Error al actualizar cita' });
    }
},

  
getCitaById: async (req, res) => {
  const { id } = req.params; // Obtener el ID de los parámetros de la solicitud
  try {
      const [rows] = await pool.query(`
          SELECT 
              citas.id,
              citas.fecha,
              citas.hora,
              citas.estado,
              CONCAT(medicos.nombre, ' ', medicos.apellido) AS nombre_completo_medico,
              pacientes.nombre AS nombre_paciente,
              citas.id_medico,      -- Incluir id_medico en la respuesta
              citas.id_paciente     -- Incluir id_paciente en la respuesta
          FROM 
              citas
          JOIN 
              medicos ON citas.id_medico = medicos.id
          JOIN 
              pacientes ON citas.id_paciente = pacientes.id
          WHERE 
              citas.id = ?
      `, [id]); // Filtrar por ID

      if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Cita no encontrada' });
      }
      
      // No es necesario modificar los IDs ya que los incluimos en la respuesta
      res.status(200).json({ success: true, cita: rows[0] }); // Devolver la cita completa
  } catch (error) {
      console.error("Error al obtener la cita:", error);
      res.status(500).json({ success: false, message: 'Error al obtener la cita' });
  }
},

  createCita: async (req, res) => {
    const { id_medico, id_paciente, fecha, hora, estado } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO citas (id_medico, id_paciente, fecha, hora, estado) VALUES (?, ?, ?, ?, ?)',
            [id_medico, id_paciente, fecha, hora, estado]
        );
        res.status(201).json({ success: true, message: 'Cita creada con éxito', id: result.insertId });
    } catch (error) {
        console.error("Error al crear cita:", error);
        res.status(500).json({ success: false, message: 'Error al crear cita' });
    }
},

  updateEncuesta: async (req, res) => {
    const { id } = req.params; // Obtener el ID de la encuesta a actualizar
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
        motivo_consulta,
    } = req.body;

    try {
        const [updated] = await DetallesEncuesta.update(
            {
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
                motivo_consulta,
            },
            {
                where: { id } // Asegúrate de usar el ID correcto
            }
        );

        if (updated) {
            res.status(200).json({ success: true, message: 'Encuesta actualizada' });
        } else {
            res.status(404).json({ success: false, message: 'Encuesta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar encuesta', error: error.message });
    }
  },

  deleteCita: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM citas WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Cita no encontrada' });
      }
      res.status(200).json({ success: true, message: 'Cita eliminada' });
    } catch (error) {
      console.error(`Error al eliminar la cita con id ${id}:`, error);
      res.status(500).json({ success: false, message: 'Error al eliminar cita' });
    }
  },

  // Obtener todas las encuestas
  getAllEncuestas: async (req, res) => {
    try {
        const encuestas = await DetallesEncuesta.findAll({
            attributes: [
                'id', 
                'cita_id', 
                'motivo_consulta', 
                'tratamiento_previo', 
                'medicamentos_actuales', 
                'condiciones_medicas', 
                'estado_emocional', 
                'sintomas_emocionales', 
                'nivel_estres', 
                'relacion_familiar', 
                'red_apoyo', 
                'situacion_laboral', 
                'actividad_fisica', 
                'patrones_sueno', 
                'alimentacion', 
                'objetivos_terapia', 
                'cambios_deseados', 
                'habilidades_deseadas', 
                'comentarios'
            ],
            tableName: 'detalles_encuesta' // Define explícitamente la tabla
        });
        
        res.status(200).json({
            success: true,
            encuestas,
            total: encuestas.length,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener encuestas', error: error.message });
    }
  },

  // Obtener una encuesta por ID
  getEncuestaById: async (req, res) => {
    const { id } = req.params;
    try {
        const encuesta = await DetallesEncuesta.findByPk(id, {
            attributes: ['id', 'cita_id', 'motivo_consulta', 'tratamiento_previo', 'medicamentos_actuales', 'condiciones_medicas', 'estado_emocional', 'sintomas_emocionales', 'nivel_estres', 'relacion_familiar', 'red_apoyo', 'situacion_laboral', 'actividad_fisica', 'patrones_sueno', 'alimentacion', 'objetivos_terapia', 'cambios_deseados', 'habilidades_deseadas', 'comentarios']
        });
        
        if (!encuesta) {
            return res.status(404).json({ success: false, message: 'Encuesta no encontrada' });
        }

        res.status(200).json({ success: true, encuesta });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener encuesta', error: error.message });
    }
  },

  createEncuesta: async (req, res) => {
    const { id_paciente, id_cita, respuestas } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO detalles_encuesta (id_paciente, id_cita, respuestas) VALUES (?, ?, ?)',
        [id_paciente, id_cita, respuestas]
      );
      res.status(201).json({ success: true, message: 'Encuesta creada con éxito', id: result.insertId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear encuesta' });
    }
  },

  deleteEncuesta: async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM detalles_encuesta WHERE id = ?', [id]);
      res.status(200).json({ success: true, message: 'Encuesta eliminada' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al eliminar encuesta' });
    }
  }  
};


export default adminController;
