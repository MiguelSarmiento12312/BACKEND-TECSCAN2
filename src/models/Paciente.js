import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; 

const Paciente = sequelize.define('Paciente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genero: {
        type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estado_civil: {
        type: DataTypes.ENUM('soltero', 'casado', 'divorciado', 'viudo', 'en pareja'),
        allowNull: true,
    },
    ocupacion: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    antecedentes_medicos: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    alergias: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    grupo_sanguineo: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
    },
    notas_adicionales: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    dni: {
        type: DataTypes.STRING(8),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'pacientes',
    timestamps: false, 
});

export default Paciente;
