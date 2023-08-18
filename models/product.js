const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  brand: String,
  category: String,
  name: String,
  quantity: Number,
  originPrice: Number,
  salePrice: Number,
  information: [String],
  manual: [String],
  images: [String],
  createdAt: Date,
});

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;