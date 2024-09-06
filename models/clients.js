"use strict";

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      clientId: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdByUserId: {  // This is the foreign key
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",  // Name of the referenced model
          key: "userId",   // Column in the referenced model
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      imestamps: true, // this will create 'createdAt' and 'updatedAt' columns
    }
  );

  Client.associate = (models) => {
    Client.hasMany(models.Loan, { foreignKey: "clientId" });
    Client.hasMany(models.Payment, { foreignKey: "clientId" });
    Client.belongsTo(models.User, { foreignKey: "createdByUserId" });
    
  };

  return Client;
};


