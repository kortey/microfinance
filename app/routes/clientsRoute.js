const express = require("express");
const authMiddleware = require("../middlewares/authmiddleware");
const adminMiddleware = require("../middlewares/adminmiddleware");
const {
  createClient,
  getClients,
  getAllClients,
  getSingleClient,
  deleteClient,
  updateClient,
} = require("../controllers/clientscontroller");
const clientRouter = express.Router();

clientRouter.post("/clients/create", [authMiddleware], createClient);
clientRouter.get("/clients", [authMiddleware], getClients);
clientRouter.get(
  "/admin/clients",
  [authMiddleware, adminMiddleware],
  getAllClients
);
clientRouter.get("/clients/:id", [authMiddleware], getSingleClient);
clientRouter.delete(
  "/clients/:id",
  [authMiddleware, adminMiddleware],
  deleteClient
);
clientRouter.put(
  "/clients/:id",
  [authMiddleware, adminMiddleware],
  updateClient
);
module.exports = {
  clientRouter,
};
