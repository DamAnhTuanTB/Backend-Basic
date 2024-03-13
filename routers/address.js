const express = require("express");
const auth = require("../middlewares/auth");

const AddressModel = require("../models/address");

const router = express.Router();

router.use(auth);

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  AddressModel.find({ userId })
    .then((addresses) => {
      res.status(200).send(addresses);
    })
    .catch((err) => res.status(500).send({ message: "Lỗi server" }));
});

router.post("/", (req, res) => {
  const data = req.body;
  AddressModel.create(data).then((data) => {
    res.status(201).send({
      message: "Thêm địa chỉ mới thành công",
    });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  AddressModel.findOneAndUpdate({ _id: id }, data)
    .then(() => {
      res.status(200).send({ message: "Cập nhật thành công." });
    })
    .catch((err) => res.status(500).send({ message: "Lỗi server" }));
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  AddressModel.deleteOne({ _id: id })
    .then(() => res.status(200).send({ message: "Xóa địa chỉ thành công." }))
    .catch((err) => res.status(500).send({ message: "Lỗi server" }));
});

module.exports = router;
