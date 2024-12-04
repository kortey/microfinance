const { User } = require("../../models");
const { Client } = require("../../models");
const { clientSchema } = require("../schema/joyschema");
const { updateClientSchema } = require("../schema/joyschema");
const createClient = async (req, res) => {
  try {
    const error = clientSchema.validate(req.body);
    if (error) {
      // return res.status(400).json({ message: error });
      console.log(error);
    }

    const existingClient = await Client.findOne({
      where: { email: req.body.email },
    });
    if (existingClient) {
      return res.status(409).json({
        status: "fail",
        message: "Client with that email already exists",
      });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      idNumber,
      email,
      phone,
      address,
    } = req.body;

    const client = await Client.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      idNumber,
      email,
      phone,
      address,
      createdByUserId: req.user.userId,
    });

    res.status(201).json({
      status: "success",
      message: "client created successfully",
      client,
    });
  } catch (error) {
    console.log(error);
  }
};

const getClients = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }
    const user = await User.findOne({
      where: { userId: req.user.userId },
      include: [
        {
          model: Client,
          as: "Clients",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "clients not found",
      });
    }

    res.json({
      status: 200,
      clients: user.Clients,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "there is an error with getting the clients",
      error: error,
    });
  }
};

const getAllClients = async (req, res) => {
  try {
    console.log("this is the get all clients route");
    const clients = await Client.findAll();
    if (!clients) {
      return res.status(404).json({
        status: 404,
        message: "clients not found",
      });
    }

    res.json({
      status: 200,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "there is an error with getting the clients",
    });
  }
};

const getSingleClient = async (req, res) => {
  try {
    const Id = req.params.id;
    const client = await Client.findOne({
      where: {
        clientId: Id,
      },
    });
    if (!client) {
      return res.status(404).json({
        status: 404,
        message: "clients not found",
      });
    }

    res.json({
      status: 200,
      client,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "there is an error with getting the clients",
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const Id = req.params.id;
    const client = await Client.destroy({
      where: {
        clientId: Id,
      },
    });
    if (!client) {
      return res.status(404).json({
        status: 404,
        message: "there is no client with this id",
      });
    }

    return res.json({
      status: 200,
      message: "client deleted successfully",
      client,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "there is an error with deleting the clients",
    });
  }
};

const updateClient = async (req, res) => {
  try {
    
    const { error } = updateClientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      idNumber,
      email,
      phone,
      address,
    } = req.body;

   
    const [updatedRowCount] = await Client.update(
      {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        idNumber,
        email,
        phone,
        address,
      },
      {
        where: {
          clientId: req.params.id,
        },
      }
    );

    
    if (updatedRowCount === 0) {
      return res
        .status(404)
        .json({ message: "Client not found or no changes made" });
    }

    
    const updatedClient = await Client.findByPk(req.params.id);

    return res.status(200).json({
      message: "Client updated successfully",
      client: updatedClient,
    });
  } catch (err) {
    console.error(err); // Log the error
    return res
      .status(500)
      .json({ message: "There was an error updating the client" });
  }
};


module.exports = {
  getSingleClient,
  getClients,
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
};
