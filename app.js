import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import medicoRoutes from './src/routes/medicoRoutes.js';
import pacientesRoutes from './src/routes/pacienteRoutes.js';
import citaRoutes from './src/routes/citaRoutes.js';
import encuestaRoutes from './src/routes/encuestaRoutes.js';
import reporteRoutes from './src/routes/reporteRoutes.js';
import administradorRoutes from './src/routes/adminRoutes.js';
import { sequelize } from './src/config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Importar modelos
import Medico from './src/models/Medico.js';
import Paciente from './src/models/Paciente.js';
import Cita from './src/models/Cita.js';
import Encuesta from './src/models/DetallesEncuesta.js';
import Reporte from './src/models/Reporte.js';
import Administrador from './src/models/Administrador.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());

// Configurar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use('/pdf', express.static(path.join(__dirname, 'src/pdfs')));

// Rutas
app.use('/medicos', medicoRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/citas', citaRoutes);
app.use('/encuestas', encuestaRoutes);
app.use('/reportes', reporteRoutes);
app.use('/admin', administradorRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Manejo de errores
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 3000;

const syncModels = async () => {
  try {
    // Definición de relaciones entre modelos
    Medico.hasMany(Cita, { foreignKey: 'id_medico', as: 'citas' });
    Cita.belongsTo(Medico, { foreignKey: 'id_medico', as: 'medico' });

    Paciente.hasMany(Cita, { foreignKey: 'id_paciente', as: 'citas' });
    Cita.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });

    await sequelize.sync(); // Sincronizar modelos
    console.log('Modelos sincronizados con la base de datos');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error);
  }
};

syncModels(); 

process.on('SIGINT', () => {
  sequelize.close().then(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
