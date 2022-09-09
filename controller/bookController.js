const Book = require("../models/book_model");
const customError = require("../utils/customError");
const asyncHandler = require("../middleware/asyncHandler");

exports.getbooks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.categoryId) {
    query = Book.find({ category: req.params.categoryId }).populate({
      path: "category",
      select: "name",
    });
  } else {
    query = Book.find().populate({
      path: "category",
      select: "name avgPrice",
    });
  }
  const books = await query;

  res.status(200).json({
    success: true,
    Request_IS: "Бүх ном авах",
    Data: books,
  });
});
exports.getbook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  res.status(200).json({
    success: true,
    Request_IS: "Ном авах",
    Data: book,
  });
});
exports.createbook = asyncHandler(async (req, res, next) => {
  const book = await Book.create(req.body);
  res.status(200).json({
    success: true,
    Request_IS: "Ном үүсгэх",
    Data: book,
  });
});
exports.updatebook = asyncHandler(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    throw new customError(
      req.params.id + ` - ийм ID-тай ном байхгүй байна`,
      400
    );
  }
  res.status(200).json({
    success: true,
    Request_IS: "Ном өөрчлөх",
    Data: book,
  });
});
exports.deletebook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new customError(
      req.params.id + ` - ийм ID-тай ном байхгүй байна`,
      400
    );
  }
  book.remove();
  res.status(200).json({
    success: true,
    Request_IS: "Ном устгах",
    Data: book,
  });
});
