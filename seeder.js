const fs = require("fs");
const colors = require("colors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const category = require("./models/category_model");
const Book = require("./models/book_model");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const categories = JSON.parse(
  fs.readFileSync(__dirname + "/data/categoryData.json", "utf-8")
);
const books = JSON.parse(
  fs.readFileSync(__dirname + "/data/book.json", "utf-8")
);

const importData = async () => {
  try {
    await category.create(categories);
    await Book.create(books);
    console.log("Өгөгдлийг import хийлээ".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await category.deleteMany();
    await Book.deleteMany();
    console.log("Өгөгдлийг delete хийлээ".red.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
