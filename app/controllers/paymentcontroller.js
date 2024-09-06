const { Payment } = require("../../models");
const { Loan } = require("../../models");
const { paymentSchema } = require("../schema/joyschema");

const createPayment = async (req, res) => {
  try {
    const { error } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const clientId = req.params.clientId;
    if (!clientId) {
      return res.status(400).json({ message: "provide client id" });
    }

    const loanId = req.params.loanId;
    if (!req.params.loanId) {
      return res.status(400).json({ message: "provide loan id" });
    }

    const paymentAmount = req.body.amount;
    if (!paymentAmount) {
      return res.status(400).json({ message: "Payment amount is required" });
    }
    console.log(paymentAmount);
    const payment = await Payment.create({
      paymentId: req.params.paymentId,
      loanId: loanId,
      clientId: clientId,
      amount: paymentAmount,
      createdByUserId: req.user.userId,
    });

    if (!payment) {
      return res.status(400).json({ message: "payment not created" });
    }

    const updatedLoan = await Loan.findOne({ where: { loanId: loanId } });

    const newAmountLeft = updatedLoan.amountLeft - paymentAmount;
    const [updatedRowCount] = await Loan.update(
      {
        amountLeft: newAmountLeft,
      },
      {
        where: {
          loanId: loanId,
        },
      }
    );

    if (updatedRowCount === 0) {
      return res.status(400).json({ message: "loan not updated" });
    }

    const newLoanResults = await Loan.findOne({ where: { loanId: loanId } });

    res.status(201).json({
      message: "payment created successfully",
      payment,
      updatedLoan,
      newLoanResults,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: {
        createdByUserId: req.user.userId,
      },
    });
    if (!payments) {
      return res.status(404).json({ message: "payments not found" });
    }
    res.status(200).json({ payments });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getClientPayments = async (req, res) => {
  const { clientId } = req.params;

  try {
    if (!clientId) {
      return res.status(400).json({ message: "provide client id" });
    }
    const payments = await Payment.findAll({
      where: {
        clientId: clientId,
      },
    });
    if (!payments) {
      return res.status(404).json({ message: "payments not found" });
    }
    res.status(200).json({ payments });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    if (!payments) {
      return res.status(404).json({ message: "payments not found" });
    }
    res.status(200).json({ payments });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deletePayment = async (req, res) => {
  try {
    let deletedAmount;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "provide payment id" });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "payment not found" });
    }

    deletedAmount = payment.amount;

    const loan = await Loan.findByPk(payment.loanId);
    if (!loan) {
      return res.status(404).json({ message: "loan not found" });
    }

    const deletedPayment = await Payment.destroy({
      where: {
        id,
      },
    });
    if (!deletedPayment) {
      return res
        .status(404)
        .json({ message: "payment not found", deletedPayment });
    }
    const newAmountLeft = +loan.amountLeft + deletedAmount;
    const [updatedRowCount] = await Loan.update(
      {
        amountLeft: newAmountLeft,
      },
      {
        where: {
          loanId: loan.loanId,
        },
      }
    );
    if (updatedRowCount === 0) {
      return res.status(400).json({ message: "loan not updated" });
    }
    res.status(200).json({ message: "payment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "provide payment id" });
    }

    const { error } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const paymentAmount = req.body.amount;
    if (!paymentAmount) {
      return res.status(400).json({ message: "Payment amount is required" });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "payment not found" });
    }

    const [updatedRowCount] = await Payment.update(
      {
        amount: paymentAmount,
      },
      {
        where: {
          id,
        },
      }
    );

    if (updatedRowCount === 0) {
      return res.status(400).json({ message: "payment not updated" });
    }

    const updatedPayment = await Payment.findOne({ where: { id } });

    const loan = await Loan.findByPk(updatedPayment.loanId);
    if (!loan) {
      return res.status(404).json({ message: "loan not found" });
    }

    let newAmountLeft;
    if (paymentAmount > +loan.amountLeft) {
      return res
        .status(400)
        .json({ message: "Payment amount cannot be greater than loan amount" });
    }

    if (paymentAmount > payment.amount) {
      const subtractedAmount = paymentAmount - payment.amount;
      newAmountLeft = +loan.amountLeft - subtractedAmount;
    } else {
      const subtractedAmount = payment.amount - paymentAmount;
      newAmountLeft = +loan.amountLeft + subtractedAmount;
    }
    const [updatedRowCount2] = await Loan.update(
      {
        amountLeft: newAmountLeft,
      },
      {
        where: {
          loanId: loan.loanId,
        },
      }
    );
    if (updatedRowCount2 === 0) {
      return res.status(400).json({ message: "loan not updated" });
    }
    res.status(200).json({
      message: "payment updated successfully",
      updatedPayment,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
module.exports = {
  createPayment,
  getPayments,
  getAllPayments,
  getClientPayments,
  deletePayment,
  updatePayment,
};
