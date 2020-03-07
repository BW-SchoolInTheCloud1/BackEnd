module.exports = (req, res, next) => {
  if (
    (req.decodedJwt.role && req.decodedJwt.role === "volunteer") ||
    req.decodedJwt.role === "student"
  ) {
    next();
  } else {
    next("you don't have permission");
  }
};
