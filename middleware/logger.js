const logger = (req, res, next) => {
  req.userId = "12asdasd34api";
  console.log(
    `${req.method} ${req.protocol} ://${req.host}${req.originalUrl} `
  );
  next();
};
module.exports = logger;
