import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Citas from '../models/Cita.js'
const DetallesEncuesta = sequelize.define('DetallesEncuesta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cita_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'citas', 
            key: 'id',
        },
    },
    motivo_consulta: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tratamiento_previo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    medicamentos_actuales: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    condiciones_medicas: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado_emocional: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sintomas_emocionales: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nivel_estres: {
        type: DataTypes.ENUM('Bajo', 'Moderado', 'Alto', 'Crítico'),
        allowNull: true,
    },
    relacion_familiar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    red_apoyo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    situacion_laboral: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    actividad_fisica: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    patrones_sueno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alimentacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    objetivos_terapia: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cambios_deseados: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    habilidades_deseadas: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comentarios: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'detalles_encuesta',
    timestamps: false, 
});

DetallesEncuesta.belongsTo(Citas, { foreignKey: 'cita_id', targetKey: 'id' });

export default DetallesEncuesta;
