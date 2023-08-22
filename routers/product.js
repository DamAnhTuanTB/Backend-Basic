const express = require('express');
const auth = require('../middlewares/auth');
const mongoose = require('mongoose');

const ProductModel = require('../models/product');

const EvaluateModel = require('../models/evaluate');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {

  let { keyword, minPrice, maxPrice, brands, category, sort, page, limit } = req.query;

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

  // const queryBrand = {
  //   path: 'brand'
  // };

  // if (brands?.length > 0) {
  //   queryBrand.match = {
  //     _id: { $in: brands }
  //   }
  // }

  // const queryCategory = {
  //   path: 'category'
  // }

  // if (!!category) {
  //   queryCategory.match = {
  //     _id: category
  //   }
  // }


  const totalProducts = await ProductModel.countDocuments(queryProduct);

  const products = await ProductModel.find(queryProduct).skip((myPage - 1) * myLimit).limit(myLimit);

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

router.get('/:id', async (req, res) => {
  let { id } = req.params;
  try {
    let productDetail = await ProductModel.findOne({ _id: id });

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

    const evaluates = await EvaluateModel.find({ product: new mongoose.Types.ObjectId(id) });

    let oneStar = 0;
    let twoStar = 0;
    let threeStar = 0;
    let fourStar = 0;
    let fiveStar = 0;

    evaluates.forEach(e => {
      switch (Number(e.numberStar)) {
        case 1:
          oneStar++;
          break;
        case 2:
          twoStar++;
          break;
        case 3:
          threeStar++;
          break;
        case 4:
          fourStar++;
          break;
        case 5:
          fiveStar++;
          break
        default:
          break;
      }
    })


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
        star: evaluateProduct.length > 0 ? Math.floor(Number(evaluateProduct[0].totalStar) / Number(evaluateProduct[0].totalEvaluate)) : 0,
        listStar: {
          oneStar,
          twoStar,
          threeStar,
          fourStar,
          fiveStar
        }
      }
    })
  }
  catch (error) {
    res.status(500).send({
      message: "Lỗi server"
    })
  }
})

router.get('/relate/:id', async (req, res) => {

  let id = req.params.id;
  try {
    const productDetail = await ProductModel.findById(id);

    const products = await ProductModel.find({category: productDetail.category})

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
  }
  catch (error) {
    res.status(500).send({
      message: "Lỗi server"
    })
  }
})

router.post('/admin', (req, res) => {
  ProductModel.create({...req.body, images: [req.body.image]}).then(data => {
    res.status(201).send({
      message: "Tạo sản phẩm thành công"
    })
  })
})

router.put('admin/:id', (req, res) => {
   const id = req.params.id;
  const data = req.body;
  if(data.image){
    data.images = [data.image];
    delete data.image;
  }
  ProductModel.findOneAndUpdate({ _id: id, user: req.user._id }, data)
    .then(() => {
      res.status(200).send({ message: "Cập nhật thành công." });
    })
    .catch((err) => res.status(500).send({ message: "Lỗi server" }));
})

router.delete("/admin/:id", (req, res) => {
  const id = req.params.id;
  ProductModel.deleteOne({ _id: id })
    .then(() => res.status(200).send({ message: "Xóa địa chỉ thành công." }))
    .catch((err) => res.status(500).send({ message: "Lỗi server" }));
});






module.exports = router;