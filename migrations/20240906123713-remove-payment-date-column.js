'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("payments", "paymentDate");
  },

  async down (queryInterface, Sequelize) {
   return queryInterface.addColumn("payments", "paymentDate", {
     type: Sequelize.DATE,
     allowNull: false,
   });
  }
};

