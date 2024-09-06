const { hash } = require("bcrypt");
const { registerSchema } = require("../schema/joyschema");
const { User } = require("../../models");

const register = async (req, res, next) => {
  try {
    const error = registerSchema.validate(req.body);
    if (error) {
      // return res.status(400).json({ message: error });
      console.log(error);
    }

    const { userName, firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({
      where: { userName, email },
      attributes: {
        exclude: ["updatedAt"],
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);
    const user = await User.create({
      userName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { register };
