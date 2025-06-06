const express = require("express");
const { register } = require("../controllers/registercontrollers");
const registerRouter = express.Router();
const adminMiddleware = require("../middlewares/adminmiddleware");
const authMiddleware = require("../middlewares/authmiddleware");

registerRouter.post(
  "/auth/register",
  register
);

module.exports = { registerRouter };
