const express = require("express");
const router = express.Router();

const booksRouter = require("./books");
router.use("/:categoryId/books", booksRouter);

//Routers
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoriesController");

//Controller Router 2-ыг холбох "

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);
module.exports = router;
