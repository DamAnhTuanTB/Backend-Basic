const express = require("express");
// const auth = require('../middlewares/auth');

const UserModel = require("../models/user");

// const bcrypt = require("bcryptjs");

const router = express.Router();

// router.use(auth);

router.post("/", async (req, res) => {
  try {
    let { name, date, email, password, telephone, gender } = req.body;
    if (!name || !date || !email || !telephone || !gender || !password) {
      return res
        .status(400)
        .send({ message: "Vui lòng gửi đầy đủ thông tin." });
    }
    // if (checkUnique) {
    //   return res.status(400).send(checkUnique);
    // }

    // req.body.password = await bcrypt.hash(req.body.password, 8);

    UserModel.create(req.body)
      .then(() => {
        res
          .status(201)
          .send({ message: "Tạo tài khoản khách hàng thành công." });
      })
      .catch((error) => {
        res.status(400).send({ message: "Vui lòng nhập đúng thông tin" });
      });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server" });
  }
});

router.get("/", async (req, res) => {
  const users = await UserModel.find().sort({ name: 1 });

  const result = users.map((user) => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      date: user.date,
      telephone: user.telephone,
      gender: user.gender,
    };
  });

  res.status(200).send({
    data: result,
  });

  //
  router.get("/:id", async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: "Không tìm thấy người dùng." });
      }
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        date: user.date,
        telephone: user.telephone,
        gender: user.gender,
      };
      res.status(200).send({ data: userData });
    } catch (error) {
      res.status(500).send({ message: "Lỗi server." });
    }
  });

  // router.get('/:id', async (req, res) => {})

  // let { keyword, page, limit, sort } = req.query;

  // const myPage = page || 1;

  // const myLimit = limit || 10;

  // const queryUser = { role: { $ne: "admin" } };

  // if (keyword) {
  //   queryUser.name = {
  //     $regex: keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
  //     $options: "i",
  //   };
  // }

  // const totalUsers = await UserModel.countDocuments(queryUser);

  // const startIndex = (myPage - 1) * myLimit;
  // const endIndex = startIndex + myLimit;

  // const users = await UserModel.find(queryUser).sort({ name: 1 });

  // const result = users.map((user) => {
  //   return {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     date: user.date,
  //     telephone: user.telephone,
  //     gender: user.gender,
  //   };
  // });

  // res.status(200).send({
  //   data: result.slice(startIndex, endIndex),
  //   totalUsers,
  //   page: Number(myPage),
  //   limit: myLimit,
  // });
});

router.put("/:id", (req, res) => {
  if (req.body.email || req.body.password) {
    res.status(400).send({ message: "Vui lòng gửi đúng dữ liệu" });
  }
  UserModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((data) => {
      res
        .status(200)
        .send({ message: "Cập nhật thông tin cá nhân thành công." });
    })
    .catch((err) => {
      res.status(500).send({ message: "Lỗi server." });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  UserModel.deleteOne({ _id: id })
    .then(async () => {
      res.status(200).send({ message: "Xóa khách hàng thành công." });
    })
    .catch((err) =>
      res.status(500).send({ message: "Xóa khách hàng thất bại" })
    );
});

module.exports = router;
