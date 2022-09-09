//Library import
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const rfs = require("rotating-file-stream");
//DOTenv аппын тохиргоо ачаалалт
dotenv.config({ path: "./config/config.env" });
//Route import  оруулж ирэх
const categoriesRoute = require("./routes/categories");
const booksRoute = require("./routes/books");
const connectDB = require("./config/db");
connectDB();
const logger = require("./middleware/logger");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");

//Express холболт
const app = express();

//Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Log File руу хийх
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

//Body parser заавал
app.use(express.json());
//Categories Route Use хийх
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/books", booksRoute);
app.use(errorHandler);
const server = app.listen(
  process.env.PORT,
  console.log(`Сэрвэр ${process.env.PORT} энэ порт дээр аслаа`.inverse.yellow)
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа:$ ${err.message}`.inverse.red);
  server.close(() => {
    process.exit(1);
  });
});
