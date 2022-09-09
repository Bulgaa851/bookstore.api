const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red.underline);
  if (err.name === "CastError") {
    err.message = "ID бүтэц алдаатай байна";
    err.statusCode = 400;
  } else if (err.name === "ValidationError") {
    err.message = "Description болон Name талбарыг заавал бөглөх ёстой";
    err.statusCode = 400;
  } else if (err.code === 11000) {
    err.message = "Database-д нэр давхардаж байна";
    err.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
  });
  console.log(err);
};
module.exports = errorHandler;
