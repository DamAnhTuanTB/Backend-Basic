const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const evaluateSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  product: {
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