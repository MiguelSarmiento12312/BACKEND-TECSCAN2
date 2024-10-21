import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import medicoRoutes from './src/routes/medicoRoutes.js';
import pacientesRoutes from './src/routes/pacienteRoutes.js';
import citaRoutes from './src/routes/citaRoutes.js';
import encuestaRoutes from './src/routes/encuestaRoutes.js';
import reporteRoutes from './src/routes/reporteRoutes.js';
import administradorRoutes from './src/routes/adminRoutes.js';
import { sequelize } from './src/config/db.js'; // Asegúrate de que aquí importas tu conexión de Sequelize
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Importar modelos y establecer asociaciones
import './src/models/associations.js'; // Asegúrate de importar las asociaciones aquí

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/pdf', express.static(path.join(__dirname, 'src/pdfs')));

app.use('/medicos', medicoRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/citas', citaRoutes);
app.use('/encuestas', encuestaRoutes);
app.use('/reportes', reporteRoutes);
app.use('/admin', administradorRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

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
