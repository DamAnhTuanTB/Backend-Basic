const mongoose = require('mongoose');
const voucherSchema = mongoose.Schema({
  name: String,
  discountPrice: Number,
  startTime: Date,
  endTime: Date
})

const VoucherModel = mongoose.model('voucher', voucherSchema);

module.exports = VoucherModel;