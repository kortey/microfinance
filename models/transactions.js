"use strict";

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction",{
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      paymentId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
          model: "Payments",  // Name of the referenced model
          key: "id",   // Column in the referenced model
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("LOAN_PAYMENT", "DEPOSIT", "WITHDRAWAL"),
        allowNull: false,
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
    }
  }
    ,{
      timestamps: true,
    });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Payment, { foreignKey: "paymentId" });
    Transaction.belongsTo(models.User, { foreignKey: "createdByUserId" });
  };

  return Transaction;
};
