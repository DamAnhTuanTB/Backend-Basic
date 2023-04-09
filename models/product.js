const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brand'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  name: String,
  quantity: Number,
  originPrice: Number,
  salePrice: Number,
  information: [String],
  manual: [String],
  images: [String]
});

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;