// app.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import medicoRoutes from './src/routes/medicoRoutes.js';
import pacientesRoutes from './src/routes/pacienteRoutes.js';
import citaRoutes from './src/routes/citaRoutes.js';
import encuestaRoutes from './src/routes/encuestaRoutes.js';
import reporteRoutes from './src/routes/reporteRoutes.js';
import { pool } from './src/config/db.js';
import path from 'path'; // Importar path
import { fileURLToPath } from 'url'; // Importar fileURLToPath
import { dirname } from 'path'; // Importar dirname

dotenv.config();

// Obtener __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());

// Middleware para manejar CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Servir archivos estáticos desde la carpeta 'src/pdfs'
app.use('/pdf', express.static(path.join(__dirname, 'src/pdfs')));

// Rutas
app.use('/medicos', medicoRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/citas', citaRoutes);
app.use('/encuestas', encuestaRoutes);
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
