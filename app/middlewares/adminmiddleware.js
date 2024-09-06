const adminMiddleware = (req, res, next) => {
  try {
    const currentUser = req.user;
    if (currentUser.role != "ADMIN") {
      res.status(401).json({
        status: 401,
        message: "you are not authorised to perform this action",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

module.exports = adminMiddleware;
