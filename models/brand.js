const mongoose = require('mongoose');
const brandSchema = mongoose.Schema({
  name: String,
})

const BrandModel = mongoose.model('brand', brandSchema);

module.exports = BrandModel;