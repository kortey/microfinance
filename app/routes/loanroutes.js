const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");

const {
  createLoan,
  getLoans,
  getAllLoans,
  getSingleLoan,
  deleteLoan,
  updateLoan,
  getClientLoans,
} = require("../controllers/loanscontrollers");

const loanRouter = express.Router();
loanRouter.post("/loans/create/:id", [authMiddleware], createLoan);
loanRouter.get("/loans", [authMiddleware], getLoans);
loanRouter.get("/admin/loans", [authMiddleware, adminMiddleware], getAllLoans);
loanRouter.get("/loans/:id", [authMiddleware], getSingleLoan);
loanRouter.delete("/loans/:id", [authMiddleware, adminMiddleware], deleteLoan);
loanRouter.put("/loans/:id", [authMiddleware, adminMiddleware], updateLoan);
loanRouter.get("/clients/:clientId/loans", [authMiddleware], getClientLoans);
module.exports = loanRouter;
