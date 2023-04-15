const express = require('express');
const auth = require('../middlewares/auth');

const ProductModel = require('../models/product');

const router = express.Router();

// router.use(auth);

router.get('/', async (req, res) => {

  let { keyword, minPrice, maxPrice, brands, category } = req.query;

  const products = await ProductModel.find({
    name: !!keyword ? { $regex: keyword, $options: 'i' } : {},
    salePrice: { $gte: minPrice ? Number(minPrice) : 0, $lte: maxPrice ? Number(maxPrice) : 999999999999 },
  }).populate({
    path: 'brand',
    match: brands?.length > 0 ? {
      _id: { $in: brands }
    } : {}
  }).populate({
    path: 'category',
    match: !!category ? {
      _id: category
    } : {}
  });

  console.log(products);
  res.status(200).send({
    data: products
  })
})

router.post('/', (req, res) => {
  ProductModel.create(req.body).then(data => {
    res.status(201).send({
      message: "Tạo sản phẩm thành công"
    })
  })
})


module.exports = router;