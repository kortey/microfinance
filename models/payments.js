"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      loanId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Loans",
          key: "loanId",
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Clients",
          key: "clientId",
        },
      },
      createdByUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.Loan, { foreignKey: "loanId" });
    Payment.belongsTo(models.Client, { foreignKey: "clientId" });
    Payment.hasMany(models.Transaction, { foreignKey: "paymentId" });
    Payment.belongsTo(models.User, { foreignKey: "createdByUserId" });
  };

  return Payment;
};
