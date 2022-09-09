const mongoose = require("mongoose");
const slugify = require("transliteration").slugify;
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Категорын нэрийг оруулана"],
      unique: [true, "Категорын нэр давхардаж болохгүй"],
      trim: true,
      maxlength: [50, "Категорын нэрний урт дээд тал нь 50-н тэмдэгт байна"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Категорын тайлбарыг заавал оруулана"],
      maxlength: [
        500,
        "Категорын тайлбарын урт дээд тал нь 500-н тэмдэгт байна",
      ],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    avgRating: {
      type: Number,
      min: [1, "Rating хамгийн багадаа 1 байна"],
      max: [10, "Rating хамгийн ихдээ 10 байна"],
    },
    avgPrice: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});
CategorySchema.pre("remove", async function (next) {
  await this.model("Book").deleteMany({ category: this._id });
  next();
});
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  this.avgRating = Math.floor(Math.random() * 10) + 1;
  // this.avgPrice = Math.floor(Math.random() * 1000000) + 3000;
  next();
});
module.exports = mongoose.model("Category", CategorySchema);
