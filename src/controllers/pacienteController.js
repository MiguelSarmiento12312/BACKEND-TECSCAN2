import Paciente from '../models/Paciente.js';
import Cita from '../models/Cita.js';
import jwt from 'jsonwebtoken'; // Asegúrate de que esta línea esté presente

// Login del paciente
export const loginPaciente = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el paciente existe
    const paciente = await Paciente.findOne({ where: { email } });
    if (!paciente) {
      return res.status(400).json({ success: false, message: 'Correo electrónico o contraseña incorrectos.' });
    }

    // Comparar la contraseña sin encriptar
    if (paciente.password !== password) {
      return res.status(400).json({ success: false, message: 'Correo electrónico o contraseña incorrectos.' });
    }

    // Crear el JWT (token de autenticación)
    const token = jwt.sign({ pacienteId: paciente.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Incluir toda la información del paciente en la respuesta
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      paciente: {
        id: paciente.id,
        nombre: paciente.nombre,
        edad: paciente.edad,
        genero: paciente.genero,
        telefono: paciente.telefono,
        email: paciente.email,
        direccion: paciente.direccion,
        fecha_nacimiento: paciente.fecha_nacimiento,
        estado_civil: paciente.estado_civil,
        ocupacion: paciente.ocupacion,
        antecedentes_medicos: paciente.antecedentes_medicos,
        alergias: paciente.alergias,
        grupo_sanguineo: paciente.grupo_sanguineo,
        notas_adicionales: paciente.notas_adicionales,
        dni: paciente.dni,
      },
    });
  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error al intentar iniciar sesión', error });
  }
};

// Obtener todos los pacientes
export const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener el id de la cita por el id del paciente
export const getIdCitaByid_paciente = async (idPaciente) => {
  try {
    const cita = await Cita.findOne({ where: { id_paciente: idPaciente } });
    return cita ? cita.id : null;
  } catch (err) {
    throw new Error('Error al buscar la cita: ' + err.message);
  }
};

// Obtener un paciente a partir del id de la cita
export const getPacienteByCitaId = async (idCita) => {
  try {
    const cita = await Cita.findOne({
      where: { id: idCita },
      include: {
        model: Paciente,
        as: 'paciente',
      },
    });

    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    return cita.paciente;
  } catch (err) {
    throw new Error('Error al buscar el paciente: ' + err.message);
  }
};

// Obtener el id de la cita por id del paciente (API)
export const getIdCitaByIdPaciente = async (req, res) => {
  const { idPaciente } = req.params;

  try {
    const idCita = await getIdCitaByid_paciente(idPaciente);

    if (!idCita) {
      return res.status(404).json({ error: 'No se encontró cita asociada con este paciente.' });
    }

    res.json({ id_cita: idCita });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener la información completa de la cita por ID de paciente
export const getCitaCompletaByIdPaciente = async (req, res) => {
  const { idPaciente } = req.params;

  try {
    const cita = await Cita.findOne({
      where: { id_paciente: idPaciente },
      include: {
        model: Paciente,
        as: 'paciente', // Asegúrate de que la relación esté configurada correctamente en el modelo
      },
    });

    if (!cita) {
      return res.status(404).json({ error: 'No se encontró una cita asociada con este paciente.' });
    }

    res.json(cita);
  } catch (err) {
    console.error('Error al buscar la cita completa:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener un paciente por su id
export const getPacienteById = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findByPk(id);
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
    dni,
    password // Nuevo campo de contraseña
  } = req.body;

  // Validación básica
  if (!nombre || !edad || !genero || !dni || !password) {
    return res.status(400).json({ error: 'Los campos nombre, edad, genero, dni y password son obligatorios.' });
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
      dni,
      password // Guarda la contraseña sin encriptar
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
    dni,
    password // Campo opcional para actualizar la contraseña
  } = req.body;

  try {
    if (!nombre || !edad || !genero || !dni) {
      return res.status(400).json({ error: 'Los campos nombre, edad, genero y dni son obligatorios.' });
    }

    const updatedFields = {
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
      dni,
    };

    // Solo agregar `password` si se proporciona en la solicitud
    if (password) {
      updatedFields.password = password;
    }

    const [updated] = await Paciente.update(updatedFields, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado.' });
    }

    res.json({ message: 'Paciente actualizado correctamente.' });
  } catch (err) {
    console.error('Error al actualizar el paciente:', err);
    res.status(500).json({ error: err.message });
  }
};
