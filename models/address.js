const mongoose = require("mongoose");
const addressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: String,
  email: String,
  telephone: String,
  address: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const AddressModel = mongoose.model("address", addressSchema);

module.exports = AddressModel;
