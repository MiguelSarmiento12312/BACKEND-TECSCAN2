//initDB.js
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;

const createTables = async () => {
    try {
        const connection = await createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
        });

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        await connection.query(`USE ${DB_NAME}`);

        // Define table creation queries
        const createMedicosTable = `
            CREATE TABLE IF NOT EXISTS medicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
        `;

        const createPacientesTable = `
            CREATE TABLE IF NOT EXISTS pacientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                fecha_nacimiento DATE,
                numero_identificacion VARCHAR(50) NOT NULL UNIQUE
            );
        `;

        const createCitasTable = `
            CREATE TABLE IF NOT EXISTS citas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_medico INT NOT NULL,
                id_paciente INT NOT NULL,
                fecha_cita DATETIME NOT NULL,
                tipo_cita VARCHAR(100),
                FOREIGN KEY (id_medico) REFERENCES medicos(id),
                FOREIGN KEY (id_paciente) REFERENCES pacientes(id)
            );
        `;

        const createDetallesEncuestaTable = `
            CREATE TABLE IF NOT EXISTS detalles_encuesta (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_cita INT NOT NULL,
                nivel_salud ENUM('bien', 'regular', 'mal') NOT NULL,
                comentarios TEXT,
                FOREIGN KEY (id_cita) REFERENCES citas(id)
            );
        `;

        const createReportesTable = `
            CREATE TABLE IF NOT EXISTS reportes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_cita INT NOT NULL,
                id_detalles_encuesta INT NOT NULL,
                fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                url_pdf VARCHAR(255) NOT NULL,
                FOREIGN KEY (id_cita) REFERENCES citas(id),
                FOREIGN KEY (id_detalles_encuesta) REFERENCES detalles_encuesta(id)
            );
        `;

        // Execute table creation queries
        await connection.query(createMedicosTable);
        await connection.query(createPacientesTable);
        await connection.query(createCitasTable);
        await connection.query(createDetallesEncuestaTable);
        await connection.query(createReportesTable);

        console.log('Tables created successfully');
        await connection.end();
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();
