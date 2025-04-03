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
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      loanAmount,
      interestRate,
      duration,
      startDate,
      endDate,
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
      amountLeft: loanAmount, // Correctly set amountLeft to loanAmount
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
    res.status(500).json({ message: "Internal server error" });
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

    res.status(200).json({ loan }); // Return the correct variable
  } catch (error) {
    console.error("Error fetching loan:", error); // Debugging log
    return res.status(500).json({ message: "Internal server error" });
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
  // Extract data from the request body
  const { loanAmount, interestRate, repaymentTerm, startDate, endDate, amountLeft } = req.body;
  
  // Validate input data using Joi schema
  const { error } = updateLoanSchema.validate({ loanAmount, interestRate, repaymentTerm, startDate, endDate, amountLeft });
  if (error) {
    console.log(error);
    return res.status(500).json({ message: error.details[0].message });
  }

  // Extract loan ID from params
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Provide loan ID" });
  }

  // Calculate the monthly interest rate and repayment
  const rate = interestRate / 100;
  const monthlyInterestRate = rate / 12;
  const monthlyRepayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, repaymentTerm)) /
    (Math.pow(1 + monthlyInterestRate, repaymentTerm) - 1);

  try {
    // Update the loan in the database
    const [updatedRowCount] = await Loan.update(
      {
        loanAmount,
        interestRate,
        repaymentTerm,
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

    // Check if the update was successful
    if (updatedRowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Loan could not be updated",
      });
    }

    // Retrieve the updated loan
    const updatedLoan = await Loan.findByPk(id);
    
    // Return the updated loan
    res.json({
      message: "Loan updated successfully",
      updatedLoan,
    });
  } catch (error) {
    console.error("Error updating loan:", error);
    res.status(500).json({ message: "An error occurred while updating the loan" });
  }
};

const getClientLoans = async (req, res) => {
  try {
    const { clientId } = req.params;
    console.log(`client id : ${clientId}`); // Debugging log
    if (!clientId) {
      return res.status(400).json({ message: "Provide client ID" });
    }

    const loans = await Loan.findAll({
      where: {
        clientId: clientId,
      },
      include: [ // Optional: Include client details if needed
        {
          model: Client,
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No loans found for this client" });
    }

    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching client loans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createLoan,
  getLoans,
  getAllLoans,
  getSingleLoan,
  deleteLoan,
  updateLoan,
  getClientLoans,
};
