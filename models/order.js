const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
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
  totalOriginPrice: Number,
  deliveryPrice: Number,
  totalPrice: Number,
  address: {
    name: String,
    email: String,
    phone: String,
    detailAddress: String
  },
  methodPayment: {
    type: String,
    enum: ['offline', 'online'],
  },
  status: {
    type: String,
    enum: ['processing', 'confirmed', 'in_transit', 'delivered', 'canceled'],
  },
  timeDelivery: {
    type: Number,
    enum: [1, 2, 3]
  },
  noteOrder: String,
  timeUpdate: Date,
  createdAt: Date,
})

const OrderModel = mongoose.model('order', orderSchema);

module.exports = OrderModel;