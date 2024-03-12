// const validator = require("validator");
const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // validate: (value) => {
    //   if (!validator.isEmail(value)) {
    //     throw new Error("Email không hợp lệ.");
    //   }
    // },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  date: {
    type: Date,
    required: false,
  },
  telephone: {
    type: String,
    unique: true,
    required: false,
    // validate: (value) => {
    //   if (!validator.isMobilePhone(value, ["vi-VN"])) {
    //     throw new Error(
    //       "Vui lòng sử dụng số điện thoại đúng định dạng của Việt Nam."
    //     );
    //   }
    // },
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user",
  },
});

// userSchema.methods.generateAuthToken = async function () {
//   // Generate an auth token for the user
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, "mk", { expiresIn: "15d" });
//   return token;
// };

// userSchema.methods.generateRefreshToken = async function () {
//   // Generate an auth token for the user
//   const user = this;
//   const refreshToken = jwt.sign({ _id: user._id }, "mk", { expiresIn: "30d" });
//   return refreshToken;
// };

// userSchema.statics.findByCredentials = async (email, password) => {
//   // Search for a user by email and password.
//   const user = await UserModel.findOne({ email });
//   if (!user) {
//     throw new Error("Sai email hoặc mật khẩu.");
//   }
//   const isPasswordMatch = await bcrypt.compare(password, user.password);
//   if (!isPasswordMatch) {
//     throw new Error("Sai email hoặc mật khẩu.");
//   }
//   return user;
// };

// userSchema.statics.checkUniqueUser = async (email, telephone) => {
//   const user1 = await UserModel.findOne({ email });
//   const user2 = await UserModel.findOne({ telephone });
//   let errorObj = {};
//   if (user1) {
//     errorObj["email"] = "Email đã tồn tại.";
//   }
//   if (user2) {
//     errorObj["telephone"] = "Số điện thoại đã tồn tại.";
//   }
//   if (!user1 && !user2) {
//     return false;
//   } else {
//     return errorObj;
//   }
// };

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
