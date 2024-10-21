'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregar la restricción de clave foránea
    await queryInterface.addConstraint('reportes_pdf', {
      fields: ['cita_id'], // Campo en la tabla reportes_pdf
      type: 'foreign key', // Tipo de constraint
      name: 'reportes_pdf_cita_id_fkey', // Nombre de la restricción
      references: {
        table: 'citas', // Tabla referenciada
        field: 'id', // Campo referenciado
      },
      onDelete: 'CASCADE', // Comportamiento al eliminar
    });
  },

  async down (queryInterface, Sequelize) {
    // Eliminar la restricción de clave foránea
    await queryInterface.removeConstraint('reportes_pdf', 'reportes_pdf_cita_id_fkey');
  }
};
