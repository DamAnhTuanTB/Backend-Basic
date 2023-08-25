const express = require("express");
// const auth = require("../middlewares/auth");

const EvaluateModel = require("../models/evaluate");

const router = express.Router();

// router.use(auth);

router.get("/", async (req, res) => {
  try {
    const results = await EvaluateModel.aggregate([
      {
        $group: {
          _id: "$product", // Nhóm theo trường product (id sản phẩm)
          totalComments: { $sum: 1 }, // Tổng số lượng đánh giá
          averageStars: { $avg: "$numberStar" }, // Trung bình cộng số sao
          star1: { $sum: { $cond: [{ $eq: ["$numberStar", 1] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$numberStar", 2] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$numberStar", 3] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$numberStar", 4] }, 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ["$numberStar", 5] }, 1, 0] } }
        }
      }
    ]);
    console.log(results); // Mảng chứa thông tin thống kê cho mỗi sản phẩm
  } catch (err) {
    console.error(err);
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

router.put("/allow-visible", async (req, res) => {
  try{
    const ids = req.body.idArr;
    await EvaluateModel.updateMany({_id: {$in: ids}}, {allowVisible: true});
    await EvaluateModel.updateMany({_id: {$nin: ids}}, {allowVisible: false});
    res.status(200).send({ message: "Cập nhật các đánh giá sẽ được xuất hiện thành công." }) 
  }catch(err){
    res.status(500).send({ message: "Cập nhật các đánh giá sẽ được xuất hiện thất bại." }) 
  }
})

module.exports = router;
