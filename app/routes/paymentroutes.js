const express = require("express");
const paymentrouter = express.Router();
const authMiddleware = require("../middlewares/authmiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");
const {
  createPayment,
  getPayments,
  getAllPayments,
  getClientPayments,
  deletePayment,
  updatePayment,
  singlePayment,
  getPaymentsByLoan, // Import getPaymentsByLoan
} = require("../controllers/paymentcontroller");

paymentrouter.post(
  "/clients/:clientId/loans/:loanId/payments",
  [authMiddleware],
  createPayment
);

paymentrouter.get(
  "/admin/payments",
  [authMiddleware, adminMiddleware],
  getAllPayments
);

paymentrouter.get(
  "/admin/clients/:clientId/payments",
  [authMiddleware],
  getClientPayments
);

paymentrouter.get("/payments", [authMiddleware], getPayments);

paymentrouter.delete(
  "/admin/payments/:id",
  [authMiddleware, adminMiddleware],
  deletePayment
);

paymentrouter.put(
  "/admin/payments/:id",
  [authMiddleware, adminMiddleware],
  updatePayment
);

// Route to get a single payment by ID
paymentrouter.get("/payments/:id", [authMiddleware], singlePayment);

// Route to get all payments for a specific loan
paymentrouter.get(
  "/loans/:loanId/payments",
  [authMiddleware],
  getPaymentsByLoan
);

module.exports = paymentrouter;
