const express = require("express");
// const auth = require('../middlewares/auth');

const ProductModel = require("../models/product");

const EvaluateModel = require("../models/evaluate");

const router = express.Router();

// router.use(auth);

const listCategory = [
  "Dầu gội đầu",
  "Sữa tắm",
  "Sữa rửa mặt",
  "Nước hoa",
  "Miếng dán mụn",
  "Kem chống nắng",
  "Kem tẩy tế bào chết",
];

router.get("/", async (req, res) => {
  let { keyword, minPrice, maxPrice, category, sort, page, limit } = req.query;

  const myPage = page || 1;

  const myLimit = limit || 10;

  const queryProduct = {
    salePrice: {
      $gte: minPrice ? Number(minPrice) : 0,
      $lte: maxPrice ? Number(maxPrice) : 999999999999,
    },
  };
  if (keyword) {
    queryProduct.name = { $regex: keyword, $options: "i" };
  }

  if (category) {
    queryProduct.category = category;
  }

  const totalProducts = await ProductModel.countDocuments(queryProduct);

  const products = await ProductModel.find(queryProduct)
    .sort({ createdAt: -1 })
    .skip((myPage - 1) * myLimit)
    .limit(myLimit);

  const responseProducts = products.map((product) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    quantity: product.quantity,
    originPrice: product.originPrice,
    salePrice: product.salePrice,
    image: product.images[0],
  }));

  // const productIds = products.map((product) => product._id);

  // const evaluateProducts = await EvaluateModel.aggregate([
  //   {
  //     $match: { product: { $in: productIds } }
  //   },
  //   {
  //     $group: {
  //       _id: "$product",
  //       totalEvaluate: { $sum: 1 },
  //       totalStar: { $sum: '$numberStar' }
  //     }
  //   }
  // ]);

  // let result = responseProducts.map(product => {
  //   let evaluateItem = evaluateProducts.find(evaluate => String(evaluate._id) === String(product.id));
  //   if (evaluateItem) {
  //     product.star = Math.floor(Number(evaluateItem.totalStar) / Number(evaluateItem.totalEvaluate))
  //   } else {
  //     product.star = 0
  //   }
  //   return product
  // })

  if (sort) {
    if (Number(sort) === 0) {
      responseProducts.sort((a, b) => a.salePrice - b.salePrice);
    } else if (Number(sort) === 1) {
      responseProducts.sort((a, b) => b.salePrice - a.salePrice);
    }
  }

  res.status(200).send({
    data: responseProducts,
    totalProducts,
    page: Number(myPage),
    limit: myLimit,
  });
});

router.post("/", (req, res) => {
  ProductModel.create({
    ...req.body,
    createdAt: new Date(),
    images: [req.body.image],
    manual: ["Hướng dẫn sử dụng"],
    information: ["Thông tin chi tiết sản phẩm"],
  })
    .then((data) => {
      res.status(201).send({
        message: "Tạo sản phẩm thành công",
      });
    })
    .catch((err) => res.status(500).send({ message: "Tạo sản phẩm thất bại" }));
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  if (data.image) {
    data.images = [data.image];
    delete data.image;
  }
  ProductModel.findOneAndUpdate({ _id: id, user: req.user._id }, data)
    .then(() => {
      res.status(200).send({ message: "Cập nhật sản phẩm thành công." });
    })
    .catch((err) =>
      res.status(500).send({ message: "Cập nhật sản phẩm thất bại" })
    );
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  ProductModel.deleteOne({ _id: id })
    .then(() => res.status(200).send({ message: "Xóa sản phẩm thành công." }))
    .catch((err) => res.status(500).send({ message: "Xóa sản phẩm thất bại" }));
});

module.exports = router;
