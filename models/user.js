"use strict";

const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userName: {
        type: DataTypes.STRING,
        unique: true,
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
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(Role),
        defaultValue: Role.USER,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Client, { foreignKey: "CreatedByUserId" });
    User.hasMany(models.Transaction, { foreignKey: "createdByUserId" });
    User.hasMany(models.Loan, { foreignKey: "createdByUserId" });
    User.hasMany(models.Payment, { foreignKey: "createdByUserId" });
  };

  return User;
};
