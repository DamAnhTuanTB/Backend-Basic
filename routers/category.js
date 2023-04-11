const express = require('express');
const auth = require('../middlewares/auth');

const CategoryModel = require('../models/category');

const router = express.Router();

// router.use(auth);

router.get('/', (req, res) => {
  CategoryModel.find().then(data => {
    res.status(200).send({
      data
    })
  }).catch(err => {
    res.status(500).send({
      message: "Lỗi server"
    })
  })
})


module.exports = router;