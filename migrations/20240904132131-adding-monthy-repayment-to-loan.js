"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Loans", "monthlyRepayment", {
      type: Sequelize.FLOAT, // or any other data type
      allowNull: false, // or false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tableName", "columnName");
  },
};
