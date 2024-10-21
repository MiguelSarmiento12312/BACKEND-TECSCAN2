// models/Reporte.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Citas from '../models/Cita.js'; 

const Reporte = sequelize.define('Reporte', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cita_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'citas', // Nombre de la tabla de Citas
            key: 'id',
        },
        onDelete: 'CASCADE', // Opcional: elimina reportes relacionados si se elimina una cita
    },
    ruta_pdf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'reportes_pdf',
    timestamps: false,
});

// Definición de la relación
Reporte.belongsTo(Citas, { foreignKey: 'cita_id', targetKey: 'id' });
Citas.hasMany(Reporte, { foreignKey: 'cita_id', sourceKey: 'id' });

// Exportar el modelo
export default Reporte;
