const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  amount: Number,
  time: Date,
});

const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;
