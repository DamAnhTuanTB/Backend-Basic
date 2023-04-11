const express = require('express');
const auth = require('../middlewares/auth');

const ProductModel = require('../models/product');

const router = express.Router();

// router.use(auth);

router.get('/', (req, res) => {
  ProductModel.find().populate('category').populate('brand').then(data => {
    res.status(200).send({
      data
    })
  }).catch(err => {
    res.status(500).send({
      message: "Lỗi server"
    })
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