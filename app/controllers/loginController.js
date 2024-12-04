const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
dotenv.config();

const { loginSchema } = require("../schema/joyschema");
const secret = process.env.JWT_SECRET;

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { userName, password } = req.body;
    const user = await User.findOne({
      where: {
        userName: userName,
      },
    });

    if (!user) {
      let error = res.status(404).json({
        status: "bad",
        message: "there is no user with the provided credentials",
      });
      return error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({
        message: "the password you entered is incorrect",
      });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
