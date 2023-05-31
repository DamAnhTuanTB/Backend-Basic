const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  products: [Object],
  totalOriginPrice: Number,
  deliveryPrice: Number,
  totalPrice: Number,
  methodPayment: {
    type: String,
    enum: ["payment_offline", "payment_online"],
  },
  name: String,
  quantity: Number,
  originPrice: Number,
  salePrice: Number,
  information: [String],
  manual: [String],
  images: [String],
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
