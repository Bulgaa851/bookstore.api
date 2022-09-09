const categoryModels = require("../models/category_model");
const customError = require("../utils/customError");
const asyncHandler = require("../middleware/asyncHandler");
exports.getCategories = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;
  const limit = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;
  ["limit", "page", "select", "sort"].forEach((el) => delete req.query[el]);
  //Pagination
  const total = await categoryModels.countDocuments();
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit - 1;
  if (end > total) end = total;

  const pagination = { total, pageCount, start, end, limit };

  if (page < pageCount) pagination.nextPage = page + 1;
  if (page > 1) pagination.prevPage = page - 1;

  const getAllCategory = await categoryModels
    .find(req.query, select)
    .sort(sort)
    .skip(start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    Request_IS: "Бүх категори авах",
    Data: getAllCategory,
    pagination,
  });
});
exports.getCategory = asyncHandler(async (req, res, next) => {
  const getOneCategory = await categoryModels
    .findById(req.params.id)
    .populate("books");
  if (!getOneCategory) {
    throw new customError(
      req.params.id + ` - ийм ID-тай категори байхгүй байна`,
      400
    );
  }
  res.status(200).json({
    success: true,
    Request_IS: `Категори авах`,
    Data: getOneCategory,
  });
});
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModels.create(req.body);
  res.status(200).json({
    success: true,
    Request_IS: "Категори нэмэх хүсэлт",
    Data: category,
  });
});
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const updateOneCategory = await categoryModels.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateOneCategory) {
    throw new customError(
      req.params.id + ` - ийм ID-тай категори байхгүй байна`,
      400
    );
  }
  res.status(200).json({
    success: true,
    Request_IS: `Категори өөрчлөх хүсэлт`,
    Data: updateOneCategory,
  });
});
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const deleteCategory = await categoryModels.findById(req.params.id);
  if (!deleteCategory) {
    throw new customError(
      req.params.id + ` - ийм ID-тай категори байхгүй байна`,
      400
    );
  }
  deleteCategory.remove();
  res.status(200).json({
    success: true,
    Request_IS: `Категори устгах хүсэлт`,
    Data: deleteCategory,
  });
});
