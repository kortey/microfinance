const express = require("express");
const { login } = require("../controllers/loginController");

const loginRouter = express.Router();

loginRouter.post("/auth/login", login);

module.exports = { loginRouter };
