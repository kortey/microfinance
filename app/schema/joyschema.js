const Joi = require("joi");
const payments = require("../../models/payments");

const registerSchema = Joi.object({
  userName: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  userName: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const clientSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  gender: Joi.string().required(),
  idNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

const updateClientSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.string().required(),
  gender: Joi.string().required(),
  idNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

const loanSchema = Joi.object({
  loanAmount: Joi.number().required(),
  interestRate: Joi.number().required(),
  duration: Joi.number().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  
});

const updateLoanSchema = Joi.object({
  loanAmount: Joi.number().required(),
  interestRate: Joi.number().required(),
  repaymentTerm: Joi.number().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  amountLeft: Joi.number().required(),
});

const paymentSchema = Joi.object({
  amount: Joi.number().required(),
});

const updatePaymentSchema = Joi.object({
  paymentId: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateLoanSchema,
  userUpdateSchema,
  clientSchema,
  updateClientSchema,
  loanSchema,
  paymentSchema,
  
};
