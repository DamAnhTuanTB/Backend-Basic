const mongoose = require('mongoose');
const historyVoucherSchema = mongoose.Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'voucher'
  },
  time: Date,
})

const HistoryVoucherModel = mongoose.model('historyVoucher', historyVoucherSchema);

module.exports = HistoryVoucherModel;