import Paciente from './Paciente.js';
import Cita from './Cita.js';

// Definir las relaciones
Paciente.hasMany(Cita, { foreignKey: 'id_paciente', as: 'citas' });
Cita.belongsTo(Paciente, { foreignKey: 'id_paciente', as: 'paciente' });

// Exportar los modelos para que puedan ser usados en otros archivos
export { Paciente, Cita };
