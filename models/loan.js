"use strict";

module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define(
    "Loan",
    {
      loanId: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      clientId: {
        // This is the foreign key
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Clients", // Name of the referenced model
          key: "clientId", // Column in the referenced model
        },
      },
      loanAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      interestRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      repaymentTerm: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      monthlyRepayment: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdByUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users", // Name of the referenced model
          key: "userId", // Column in the referenced model
        },
      },
      amountLeft: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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

  Loan.associate = (models) => {
    Loan.belongsTo(models.Client, { foreignKey: "clientId" });
    Loan.belongsTo(models.User, { foreignKey: "createdByUserId" });
    Loan.hasMany(models.Payment, { foreignKey: "loanId" });
  };

  return Loan;
};
