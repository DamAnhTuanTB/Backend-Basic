const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brand",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  name: String,
  quantity: Number,
  originPrice: Number,
  salePrice: Number,
  information: [String],
  manual: [String],
  images: [String],
  createdAt: Date,
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
