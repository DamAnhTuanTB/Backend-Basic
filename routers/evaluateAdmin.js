const express = require("express");
// const auth = require("../middlewares/auth");

const EvaluateModel = require("../models/evaluate");

const ProductModel = require('../models/product')

const router = express.Router();

// router.use(auth);

router.get("/", async (req, res) => {
  let {keyword, page, limit } = req.query;

  keyword = keyword || '';

  const myPage = page || 1;

  const myLimit = limit || 10;

  try {
    //  const totalEvaluate = await BrandModel.countDocuments(queryBrand);
    const result = await EvaluateModel.aggregate([
  // Lookup và Unwind đầu tiên để áp dụng match
      {
        $lookup: {
          from: ProductModel.collection.name,
          localField: "product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      // Match sản phẩm bằng tên
      {
        $match: {
          "productDetails.name": {$regex: keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i'}
        }
      },
      // Group
      {
        $group: {
          _id: "$product",
          totalReviews: { $sum: 1 },
          averageStars: { $avg: "$numberStar" },
          star1: { $sum: { $cond: [{ $eq: ["$numberStar", 1] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$numberStar", 2] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$numberStar", 3] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$numberStar", 4] }, 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ["$numberStar", 5] }, 1, 0] } }
        }
      },
      // Phân trang
      {
        $skip: (myPage - 1) * myLimit
      },
      {
        $limit: myLimit
      },
      // Thêm lại Lookup và Unwind để có thông tin sản phẩm
      {
        $lookup: {
          from: ProductModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      // Project
      {
        $project: {
          productId: "$productDetails._id",
          productName: "$productDetails.name",
          totalReviews: 1,
          averageStars: 1,
          star1: 1,
          star2: 1,
          star3: 1,
          star4: 1,
          star5: 1,
        }
      }
    ]);

    const response = result.map(item => ({
      productId: item.productId,
      productName: item.productName,
      totalReviews: item.totalReviews,
      averageStars: item.averageStars,
      star1: item.star1,
      star2: item.star2,
      star3: item.star3,
      star4: item.star4,
      star5: item.star5
    }))

      const count = await EvaluateModel.aggregate([
  // Lookup và Unwind đầu tiên để áp dụng match
      {
        $lookup: {
          from: ProductModel.collection.name,
          localField: "product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      // Match sản phẩm bằng tên
      {
        $match: {
          "productDetails.name": {$regex: keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i'}
        }
      },
      // Group
      {
        $group: {
          _id: "$product",
        }
      },
      {
        $count: 'uniqueProducts'
      }
    ]);

    const uniqueProductCount = count.length ? count[0].uniqueProducts : 0

    res.status(200).send({
        data: response,
        totalProducts: uniqueProductCount,
        page: Number(myPage),
        limit: myLimit,
      });
  } catch (err) {
    res.status(500).send({
    message: 'Lỗi server.'
  });
  }
})

router.get("/:id", async (req, res) => {
  try {
    let idProduct = req.params.id;
    let {sortStar, sortDate, page, limit} = req.query;

    sortStar = Number(sortStar);
    sortDate = Number(sortDate)

    const myPage = Number(page) || 1;

    const myLimit = Number(limit) || 10;

    const sortCondition = {};

    if(sortStar){
        sortCondition.numberStar = sortStar
    }

    if(sortDate){
        sortCondition.time = sortDate
    }

    const totalEvaluates = await EvaluateModel.countDocuments({});
    
    const data = await EvaluateModel.find({ product: idProduct }).sort(sortCondition)
      .populate("user").skip((myPage - 1) * myLimit).limit(myLimit);

      const result = data.map((e) => ({
        evaluateId: e._id,
        user: e.user.name,
        star: e.numberStar,
        comment: e.comment,
        time: e.time,
        }))
      
    res.status(200).send({
        data: result,
        totalEvaluates,
        page: Number(myPage),
        limit: myLimit
    })

  } catch (error) {
    res.status(500).status("Lỗi server");
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  EvaluateModel.deleteOne({ _id: id })
    .then(async () => {
        res.status(200).send({ message: "Xóa đánh giá thành công." })} )
    .catch((err) => res.status(500).send({ message: "Xóa đánh giá thất bại." }));
});

router.put("/allow-visible/:id", async (req, res) => {
  try{
    const productId = req.params.id;
    const ids = req.body.idArr;
    await EvaluateModel.updateMany({_id: {$in: ids}, product: productId}, {allowVisible: true});
    await EvaluateModel.updateMany({_id: {$nin: ids}, product: productId}, {allowVisible: false});
    res.status(200).send({ message: "Cập nhật các đánh giá sẽ được xuất hiện thành công." }) 
  }catch(err){
    res.status(500).send({ message: "Cập nhật các đánh giá sẽ được xuất hiện thất bại." }) 
  }
})

module.exports = router;
