const express = require("express");
const { hash } = require("bcrypt");

const { userUpdateSchema } = require("../schema/joyschema");
const { User } = require("../../models");

const getUsers = async (req, res) => {
  try {
    console.log("this is our user controller");
    const allUsers = await User.findAll({
      attributes: {
        exclude: ["updatedAt"],
      },
    });
    res.status(200).json({
      status: "success",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    const singleUser = await User.findOne({
      where: {
        userId: id,
      },
    });

    if (!singleUser) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: singleUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        userId: req.params.id,
      },
    });
    res.status(200).json({
      message: "user deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { userName, firstName, lastName, email, password } = req.body;
    const id = req.params.id;

    const hashedPassword = await hash(password, 10);

    const [updatedRowCount] = await User.update(
      {
        userName,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      {
        where: {
          userId: id,
        },
        returning: true,
      }
    );

    if (updatedRowCount) {
      return res.status(404).json({ message: "user not found" });
    }

    const updatedUser = await User.findByPk(id);

    return res.status(200).json({
      status: 201,
      message: "user updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.error(err);
  }
};
module.exports = {
  getUsers,
  getSingleUser,
  deleteUser,
  UpdateUser,
};
