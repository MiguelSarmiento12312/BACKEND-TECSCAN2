import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import medicoRoutes from './routes/medicoRoutes.js';
import pacientesRoutes from './routes/pacienteRoutes.js';
import citaRoutes from './routes/citaRoutes.js';
import encuestaRoutes from './routes/encuestaRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';
import { pool } from './config/db.js'; // Asegúrate de que estás importando correctamente tu pool de conexión

dotenv.config();

const app = express();

app.use(bodyParser.json()); // Middleware para parsear JSON en las peticiones

// Middleware para manejar CORS si es necesario
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Rutas de médicos
app.use('/medicos', medicoRoutes);

// Rutas de pacientes
app.use('/pacientes', pacientesRoutes);

// Rutas de citas
app.use('/citas', citaRoutes);

// Rutas de encuestas
app.use('/encuestas', encuestaRoutes);

// Rutas de reportes
app.use('/reportes', reporteRoutes);

// Middleware para manejar errores de ruta no encontrada
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Middleware para manejar otros errores
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Manejar la terminación del servidor y cerrar conexiones de base de datos si es necesario
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});
