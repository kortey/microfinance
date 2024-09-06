const { Loan } = require("../../models");
const { loanSchema, updateLoanSchema } = require("../schema/joyschema");
const { User } = require("../../models");
const { Client } = require("../../models");
const { where } = require("sequelize");
const { required } = require("joi");

const createLoan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "provide client id" });
    }
    const { error } = loanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const {
      loanAmount,
      interestRate,
      duration,
      startDate,
      endDate,
      amountLeft,
    } = req.body;
    const rate = interestRate / 100;
    const monthlyIterestRate = rate / 12;

    const monthlyRepayment =
      (loanAmount *
        monthlyIterestRate *
        Math.pow(1 + monthlyIterestRate, duration)) /
      (Math.pow(1 + monthlyIterestRate, duration) - 1);

    const newLoan = await Loan.create({
      loanAmount,
      interestRate,
      repaymentTerm: duration,
      startDate,
      endDate,
      monthlyRepayment,
      amountLeft,
      clientId: id,
      createdByUserId: req.user.userId,
    });

    if (!newLoan) {
      return res.status(500).json({ message: "could not create loan" });
    }

    const getTotalLoan = newLoan.monthlyRepayment * newLoan.repaymentTerm;

    res.status(201).json({
      message: "loan created successfully",
      loan: newLoan,
      totalLoan: getTotalLoan,
    });
  } catch (error) {
    console.log(error);
  }
};

const getLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: {
        createdByUserId: req.user.userId,
      },
      include: [
        {
          model: Client,
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    if (!loans) {
      return res.status(404).json({ message: "no loans found" });
    }

    res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        {
          model: Client,
          attributes: ["firstName", "lastName"],
        },
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    if (!loans) {
      return res.status(404).json({ message: "no loans found" });
    }

    res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const getSingleLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      where: {
        loanId: req.params.id,
      },
      include: [
        {
          model: Client,
          attributes: ["firstName", "lastName"],
        },
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    if (!loan) {
      return res.status(404).json({ message: "no loans found" });
    }

    res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "provide loan id" });
    }
    const deletedLoan = await Loan.destroy({
      where: {
        loanId: id,
      },
    });
    if (!deletedLoan) {
      return res.status(404).json({ message: "loan not found" });
    }
    res.status(200).json({ message: "loan deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const updateLoan = async (req, res) => {
  const { error } = updateLoanSchema.validate(req.body);
  if (error) {
    return res.status(500).json({ message: error.details[0].message });
  }

  const { loanAmount, interestRate, duration, startDate, endDate, amountLeft } =
    req.body;
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "provide loan id" });
  }

  const rate = interestRate / 100;
  const monthlyIterestRate = rate / 12;
  const monthlyRepayment =
    (loanAmount *
      monthlyIterestRate *
      Math.pow(1 + monthlyIterestRate, duration)) /
    (Math.pow(1 + monthlyIterestRate, duration) - 1);

  const [updatedRowCount] = await Loan.update(
    {
      loanAmount,
      interestRate,
      repaymentTerm: duration,
      startDate,
      endDate,
      monthlyRepayment,
      amountLeft,
    },
    {
      where: {
        loanId: id,
      },
    }
  );

  if (updatedRowCount === 0) {
    return res.status(404).json({
      status: "fail",
      message: "user could not be updated",
    });
  }

  const updatedLoan = await Loan.findByPk(id);
  res.json({
    message: "loan updated successfuly",
    updatedLoan,
  });
};
module.exports = {
  createLoan,
  getLoans,
  getAllLoans,
  getSingleLoan,
  deleteLoan,
  updateLoan,
};
