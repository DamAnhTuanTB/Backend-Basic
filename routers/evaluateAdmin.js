const express = require("express");
// const auth = require("../middlewares/auth");

const EvaluateModel = require("../models/evaluate");

const router = express.Router();

// router.use(auth);

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

module.exports = router;
