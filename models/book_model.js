const mongoose = require("mongoose");
const slugify = require("transliteration").slugify;
const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Номын нэрийг оруулана"],
      unique: [true, "Номын нэр давхардаж болохгүй"],
      trim: true,
      maxlength: [250, "Номын нэрний урт дээд тал нь 250-н тэмдэгт байна"],
    },
    photo: {
      type: String,
      default: "no-photo.png",
    },
    author: {
      type: String,
      required: [true, "Номын зохиогчийн нэрийг оруулана"],
      trim: true,
      maxlength: [50, "Зохиогчийн нэрний урт дээд тал нь 50-н тэмдэгт байна"],
    },
    rating: {
      type: Number,
      min: [1, "Rating хамгийн багадаа 1 байна"],
      max: [10, "Rating хамгийн ихдээ 10 байна"],
    },
    price: {
      type: Number,
      required: [true, "Номын үнийг оруулана"],
      min: [0, "Price хамгийн багадаа 0 MNT байна"],
    },
    total: Number,
    content: {
      type: String,
      trim: true,
      required: [true, "Номын тайлбарыг заавал оруулана"],
      maxlength: [5000, "Номын тайлбарын урт дээд тал нь 5000-н тэмдэгт байна"],
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    available: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
BookSchema.statics.categoryAvgPrice = async function (catID) {
  const obj = await this.aggregate([
    {
      $match: { category: catID },
    },
    {
      $group: { _id: "$category", averagePrice: { $avg: "$price" } },
    },
  ]);
  await this.model("Category").findByIdAndUpdate(catID, {
    avgPrice: Math.floor(obj[0].averagePrice),
  });
  return obj;
};
BookSchema.post("save", function () {
  this.constructor.categoryAvgPrice(this.category);
});
BookSchema.post("remove", function () {
  this.constructor.categoryAvgPrice(this.category);
});
module.exports = mongoose.model("Book", BookSchema);
