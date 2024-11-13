import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Paciente from './Paciente.js'; // Asegúrate de importar el modelo Paciente
import Medico from './Medico.js'; // Asegúrate de importar el modelo Medico

const Cita = sequelize.define('Cita', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true, // Asegura que sea una fecha válida
            isFuture(value) {
                if (new Date(value) < new Date()) {
                    throw new Error('La fecha no puede estar en el pasado.');
                }
            }
        }
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    id_medico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Medico, // Se refiere al modelo Medico
            key: 'id'
        }
    },
    id_paciente: {
        type: DataTypes.INTEGER,
        references: {
            model: Paciente, // Se refiere al modelo Paciente
            key: 'id'
        },
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('1', '0'), // Ejemplo de uso de ENUM
        allowNull: false,
        defaultValue: '1' 
    },
    qr_path: {
        type: DataTypes.STRING,
        allowNull: true, // La ruta del QR es opcional hasta que se genere el código
    }
}, {
    tableName: 'citas',
    timestamps: false, // Cambiar a true si deseas usar timestamps
});

// Definición de relaciones
Cita.associate = (models) => {
    Cita.hasMany(models.DetallesEncuesta, { foreignKey: 'cita_id' });
    Cita.belongsTo(models.Medico, { foreignKey: 'id_medico', as: 'medico' });
    Cita.belongsTo(models.Paciente, { foreignKey: 'id_paciente', as: 'paciente' }); // Asociación correcta con Paciente
};

export default Cita;
