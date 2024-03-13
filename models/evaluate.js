const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const evaluateSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  numberStar: Number,
  comment: String,
  allowVisible: {
    type: Boolean,
    default: false
  },
  time: Date
})

const EvaluateModel = mongoose.model('evaluate', evaluateSchema);

module.exports = EvaluateModel;