const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address'
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'voucher'
  },
  amount: Number,
  totalMoney: Number,
  status: {
    type: String,
    enum: ['processing', 'in_transit', 'delivered', 'canceled'],
    required: true
  },
  time: Date
})

const OrderModel = mongoose.model('order', orderSchema);

module.exports = OrderModel;