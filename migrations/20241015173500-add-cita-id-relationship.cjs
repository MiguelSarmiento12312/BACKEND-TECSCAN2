'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint('detalles_encuesta', {
            fields: ['cita_id'],
            type: 'foreign key',
            name: 'fk_detalles_encuesta_cita', // nombre de la restricción
            references: {
                table: 'citas',
                field: 'id',
            },
            onDelete: 'cascade', // O el comportamiento que desees
            onUpdate: 'cascade',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('detalles_encuesta', 'fk_detalles_encuesta_cita');
    },
};
