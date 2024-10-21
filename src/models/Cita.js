import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Cita = sequelize.define('Cita', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    id_medico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'medicos', 
            key: 'id'
        }
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pacientes',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1 
    }
}, {
    tableName: 'citas',
    timestamps: false, 
});

export default Cita;
