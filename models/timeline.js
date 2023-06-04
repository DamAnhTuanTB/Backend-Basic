const mongoose = require('mongoose');
const timelineSchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order'
  },
  status: {
    type: String,
    enum: ['processing', 'in_transit', 'delivered', 'canceled'],
    required: true
  },
  timeUpdate: Date
})

const TimelineModel = mongoose.model('timeline', timelineSchema);

module.exports = TimelineModel;