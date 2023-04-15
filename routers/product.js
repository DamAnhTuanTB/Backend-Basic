const express = require('express');
const auth = require('../middlewares/auth');

const ProductModel = require('../models/product');

const router = express.Router();

// router.use(auth);

router.get('/', async (req, res) => {
  let query = req.query;
  const products = await ProductModel.find().populate('category').populate('brand');
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