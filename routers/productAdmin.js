const express = require('express');
// const auth = require('../middlewares/auth');

const ProductModel = require('../models/product');

const EvaluateModel = require('../models/evaluate');

const router = express.Router();

// router.use(auth);

router.get('/', async (req, res) => {

  let { keyword, minPrice, maxPrice, brand, category, sort, page, limit } = req.query;

  const myPage = page || 1;

  const myLimit = limit || 12;

  const queryProduct = {
    salePrice: { $gte: minPrice ? Number(minPrice) : 0, $lte: maxPrice ? Number(maxPrice) : 999999999999 }
  };
  if (keyword) {
    queryProduct.name = { $regex: keyword, $options: 'i' }
  }

  if(category){
    queryProduct.category = category
  }

  if(brand){
    queryProduct.brand = brand;
  }

  const totalProducts = await ProductModel.countDocuments(queryProduct);

  const products = await ProductModel.find(queryProduct).skip((myPage - 1) * myLimit).limit(myLimit);

  const responseProducts = products.map(product => ({
    id: product._id,
    name: product.name,
    salePrice: product.salePrice,
    originPrice: product.originPrice,
    image: product.images[0],
    category: product.category,
    brand: product.brand
  }))

  const productIds = products.map((product) => product._id);

  const evaluateProducts = await EvaluateModel.aggregate([
    {
      $match: { product: { $in: productIds } }
    },
    {
      $group: {
        _id: "$product",
        totalEvaluate: { $sum: 1 },
        totalStar: { $sum: '$numberStar' }
      }
    }
  ]);

  let result = responseProducts.map(product => {
    let evaluateItem = evaluateProducts.find(evaluate => String(evaluate._id) === String(product.id));
    if (evaluateItem) {
      product.star = Math.floor(Number(evaluateItem.totalStar) / Number(evaluateItem.totalEvaluate))
    } else {
      product.star = 0
    }
    return product
  })

  if (sort) {
    if (Number(sort) === 0) {
      result.sort((a, b) => a.salePrice - b.salePrice)
    } else if (Number(sort) === 1) {
      result.sort((a, b) => b.salePrice - a.salePrice)
    }
  }

  res.status(200).send({
    data: result,
    totalProducts,
    page: Number(myPage),
    limit: myLimit
  })
})


router.post('/', (req, res) => {
  ProductModel.create({...req.body, images: [req.body.image]}).then(data => {
    res.status(201).send({
      message: "Tạo sản phẩm thành công"
    })
  }).catch((err) => res.status(500).send({ message: "Tạo sản phẩm thất bại" }))
})

router.put('/:id', (req, res) => {
   const id = req.params.id;
  const data = req.body;
  if(data.image){
    data.images = [data.image];
    delete data.image;
  }
  ProductModel.findOneAndUpdate({ _id: id, user: req.user._id }, data)
    .then(() => {
      res.status(200).send({ message: "Cập nhật sản phẩm thành công." });
    })
    .catch((err) => res.status(500).send({ message: "Cập nhật sản phẩm thất bại" }));
})

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  ProductModel.deleteOne({ _id: id })
    .then(() => res.status(200).send({ message: "Xóa sản phẩm thành công." }))
    .catch((err) => res.status(500).send({ message: "Xóa sản phẩm thất bại" }));
});




module.exports = router;