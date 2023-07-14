const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: String,
      image: String,
      amount: Number,
      price: Number,
    }
  ],
  listCartId: [mongoose.Schema.Types.ObjectId],
  totalOriginPrice: Number,
  deliveryPrice: Number,
  totalPrice: Number,
  timeUpdate: Date
});

const ProductModel = mongoose.model("payment", paymentSchema);

module.exports = ProductModel;
