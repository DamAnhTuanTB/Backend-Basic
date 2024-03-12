const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  name: String,
});

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;
