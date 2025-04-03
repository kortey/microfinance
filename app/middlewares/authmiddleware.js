const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
dotenv.config();

const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "sory you are not authorized",
      status: 401,
    });
  }

  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findOne({
      where: {
        userId: payload.userId,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "unautorised user",
        status: 401,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "token expired. please log in again",
        status: 401,
      });
    }
  }
};

module.exports = authMiddleware;
