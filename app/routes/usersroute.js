const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");

const usersRouter = express.Router();

//importing from controllers
const {
  getUsers,
  getSingleUser,
  deleteUser,
  UpdateUser,
} = require("../controllers/userscontroller");

usersRouter.get("/users", [authMiddleware, adminMiddleware], getUsers);
usersRouter.get("/users/:id", [authMiddleware, adminMiddleware], getSingleUser);
usersRouter.delete("/users/:id", [authMiddleware, adminMiddleware], deleteUser);
usersRouter.put("/users/:id", [authMiddleware, adminMiddleware], UpdateUser);

module.exports = usersRouter;
