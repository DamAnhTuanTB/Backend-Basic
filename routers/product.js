const express = require('express');
const auth = require('../middlewares/auth');
const mongoose = require('mongoose');

const ProductModel = require('../models/product');

const EvaluateModel = require('../models/evaluate');

const router = express.Router();

// router.use(auth);

router.get('/', async (req, res) => {

  let { keyword, minPrice, maxPrice, brands, category } = req.query;

  const queryProduct = {
    salePrice: { $gte: minPrice ? Number(minPrice) : 0, $lte: maxPrice ? Number(maxPrice) : 999999999999 }
  };
  if (keyword) {
    queryProduct.name = { $regex: keyword, $options: 'i' }
  }

  const queryBrand = {
    path: 'brand'
  };

  if (brands?.length > 0) {
    queryBrand.match = {
      _id: { $in: brands }
    }
  }

  const queryCategory = {
    path: 'category'
  }

  if (!!category) {
    queryCategory.match = {
      _id: category
    }
  }

  const products = await ProductModel.find(queryProduct).populate(queryCategory);

  const responseProducts = products.map(product => ({
    id: product._id,
    name: product.name,
    salePrice: product.salePrice,
    originPrice: product.originPrice,
    image: product.images[0]
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

  res.status(200).send({
    data: result
  })
})

router.get('/:id', async (req, res) => {
  let { id } = req.params;
  let productDetail = await ProductModel.findOne({ _id: id }).populate("category");

  const evaluateProduct = await EvaluateModel.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: "$product",
        totalEvaluate: { $sum: 1 },
        totalStar: { $sum: '$numberStar' }
      }
    }
  ]);

  res.status(200).send({
    data: {
      id: productDetail._id,
      name: productDetail.name,
      images: productDetail.images,
      salePrice: productDetail.salePrice,
      originPrice: productDetail.originPrice,
      information: productDetail.information,
      manual: productDetail.manual,
      totalEvaluate: evaluateProduct?.length > 0 ? evaluateProduct[0].totalEvaluate : 0,
      star: evaluateProduct.length > 0 ? Math.floor(Number(evaluateProduct[0].totalStar) / Number(evaluateProduct[0].totalEvaluate)) : 0
    }
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