const mongoose = require("mongoose");
const brandSchema = mongoose.Schema({
  name: String,
  createdAt: Date,
});

const BrandModel = mongoose.model("brand", brandSchema);

module.exports = BrandModel;
