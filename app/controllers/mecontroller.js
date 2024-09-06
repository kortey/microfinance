const meController = async (req, res, next) => {
  res.json(req.user);
};

module.exports = meController;
