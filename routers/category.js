const express = require("express");
const auth = require("../middlewares/auth");

const CategoryModel = require("../models/category");

const router = express.Router();

// router.use(auth);

router.get("/", async (req, res) => {
  const categories = await CategoryModel.find().sort({ createdAt: -1 });

  const result = categories.map((category) => {
    return {
      id: category._id,
      name: category.name,
      createdAt: category.createdAt,
    };
  });

  res.status(200).send({
    data: result,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.findById(id);
  res.status(200).send({
    data: category,
  });
});

router.post("/", async (req, res) => {
  const categoryCurrent = await CategoryModel.findOne({ name: req.body.name });

  if (categoryCurrent) {
    return res.status(400).send({
      message:
        "Không được tạo trùng tên danh mục. Vui lòng nhập lại tên danh mục.",
    });
  }

  CategoryModel.create({ ...req.body, createdAt: new Date() }).then((data) => {
    res.status(201).send({
      message: "Tạo danh mục thành công.",
    });
  });
});

// router.get('/', (req, res) => {
//   CategoryModel.find().then(data => {
//     res.status(200).send({
//       data
//     })
//   }).catch(err => {
//     res.status(500).send({
//       message: "Lỗi server"
//     })
//   })
// })

module.exports = router;
