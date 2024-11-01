import Paciente from '../models/Paciente.js';
import Cita from '../models/Cita.js'; // Asegúrate de tener el modelo Cita

// Obtener todos los pacientes
export const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll(); // Utiliza Sequelize para obtener todos los pacientes
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener el id de la cita por el id del paciente
export const getIdCitaByid_paciente = async (idPaciente) => {
  try {
    const cita = await Cita.findOne({ where: { id_paciente: idPaciente } }); // Asegúrate de que el nombre de la columna sea correcto
    return cita ? cita.id : null; // Devuelve el ID de la cita si existe, o null si no
  } catch (err) {
    throw new Error('Error al buscar la cita: ' + err.message);
  }
};

// Obtener un paciente a partir del id de la cita
export const getPacienteByCitaId = async (idCita) => {
  try {
    // Buscar la cita con el id proporcionado, e incluir el modelo Paciente en la consulta
    const cita = await Cita.findOne({
      where: { id: idCita },
      include: {
        model: Paciente,
        as: 'paciente', // Usa el mismo alias que definiste en el modelo
      },
    });

    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    return cita.paciente; // Devuelve el paciente asociado a la cita
  } catch (err) {
    throw new Error('Error al buscar el paciente: ' + err.message);
  }
};

// Obtener el id de la cita por id del paciente (API)
export const getIdCitaByIdPaciente = async (req, res) => {
  const { idPaciente } = req.params;

  try {
    // Llamar a la función para obtener id_cita por id_paciente
    const idCita = await getIdCitaByid_paciente(idPaciente);

    if (!idCita) {
      return res.status(404).json({ error: 'No se encontró cita asociada con este paciente.' });
    }

    // Responder con el id_cita
    res.json({ id_cita: idCita });
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

// Obtener un paciente por su id
export const getPacienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findByPk(id); // Encuentra paciente por ID
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo paciente
export const createNewPaciente = async (req, res) => {
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

    res.status(201).json(nuevoPaciente);
  } catch (err) {
    console.error('Error al crear el paciente:', err);
    res.status(500).json({ error: err.message });
  }
};

// Modificar un paciente existente
export const updatePaciente = async (req, res) => {
  const { id } = req.params;
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

  try {
    // Validación básica
    if (!nombre || !edad || !genero || !dni) {
      return res.status(400).json({ error: 'Los campos nombre, edad, genero y dni son obligatorios.' });
    }

    const [updated] = await Paciente.update(
      {
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
      },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado.' });
    }

    res.json({ message: 'Paciente actualizado correctamente.' });
  } catch (err) {
    console.error('Error al actualizar el paciente:', err);
    res.status(500).json({ error: err.message });
  }
};
