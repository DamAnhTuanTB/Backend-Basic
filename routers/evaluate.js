const express = require("express");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");

const EvaluateModel = require("../models/evaluate");

const router = express.Router();

// router.use(auth);

router.get("/:id", (req, res) => {
  try {
    let idProduct = req.params.id;
    EvaluateModel.find({ product: idProduct, allowVisible: true })
      .populate("user")
      .then((data) => {
        res.status(200).send({
          data: data.map((e) => ({
            user: e.user.name,
            star: e.numberStar,
            comment: e.comment,
            time: e.time,
          })),
        });
      })
      .catch(() => {
        res.status(500).status("Lỗi server");
      });
  } catch (error) {
    res.status(500).status("Lỗi server");
  }
});

router.post("/", async (req, res) => {
  try {
    EvaluateModel.create({
      ...req.body,
      time: new Date(),
      user: req.user._id,
    }).then((data) => {
      res.status(200).send({
        message: "Chúng tôi đã ghi nhận đánh giá của bạn. Đánh giá của bạn sẽ được xét duyệt bởi admin. Cảm ơn bạn.",
      });
    });
  } catch (error) {
    res.status(500).status("Lỗi server");
  }
});

module.exports = router;
