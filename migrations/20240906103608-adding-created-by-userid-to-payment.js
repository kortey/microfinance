'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn("Payments", "createdByUserId", {
       type: Sequelize.STRING,
       references: {
         model: "Users",
         key: "userId",
       },
       onUpdate: "CASCADE",
       onDelete: "SET NULL",
     });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn("Payments", "createdByUserId");
  }
};
