const userErrorMiddleware = (err, req, res, next) => {
  

  res.status(err.statusCode || 401).json({
    message: err.message || "internal server error",
  });
  console.log(err);

  next();
};

module.exports = userErrorMiddleware;
