const express = require("express");
const meRouter = express.Router();
const meController = require("../controllers/mecontroller");
const authMiddleware = require("../middlewares/authmiddleware");

meRouter.get("/auth/me", [authMiddleware], meController);

module.exports = meRouter;
