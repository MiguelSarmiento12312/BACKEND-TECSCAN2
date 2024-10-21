'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('detalles_encuesta', 'nivel_estres', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('detalles_encuesta', 'nivel_estres', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
