module.exports = (req, res, next) => {
  if (req.decodedJwt.role && req.decodedJwt.role === "admin") {
    next();
  } else {
    next("you don't have permission");
  }
};
