'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("Users", {
        userId: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        userName: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM,
          values: ["ADMIN", "USER"],
          defaultValue: "USER",
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      });

      await queryInterface.addIndex("Users", ["userName"], {
        unique: true,
      });

      await queryInterface.addIndex("Users", ["email"], {
        unique: true,
      });
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.dropTable("Users");
  }
};
