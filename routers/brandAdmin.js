const express = require("express");
// const auth = require('../middlewares/auth');

const BrandModel = require("../models/brand");

const router = express.Router();

// router.use(auth);
router.post("/", async (req, res) => {
  const brandCurrent = await BrandModel.findOne({ name: req.body.name });

  if (brandCurrent) {
    return res.status(400).send({
      message:
        "Không được tạo trùng tên thương hiệu. Vui lòng nhập lại tên thương hiệu.",
    });
  }

  BrandModel.create({...req.body, createdAt: new Date()}).then((data) => {
    res.status(201).send({
      message: "Tạo thương hiệu thành công.",
    });
  });
});

router.get("/", async (req, res) => {
  let { keyword, page, limit, sortDate } = req.query;

  sortDate = Number(sortDate);

  const myPage = page || 1;

  const myLimit = limit || 10;

  const queryBrand = {};

  if (keyword) {
    queryBrand.name = {
      $regex: keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      $options: "i",
    };
  }

  const sortDateCondition = {};

  if (sortDate) {
    sortDateCondition.createdAt = sortDate;
  }

  const totalBrands = await BrandModel.countDocuments(queryBrand);

  const brands = await BrandModel.find(queryBrand)
    .sort({ name: 1 })
    .sort(sortDateCondition)
    .skip((myPage - 1) * myLimit)
    .limit(myLimit);

  const result = brands.map((brand) => {
    return {
      id: brand._id,
      name: brand.name,
      image: brand.image,
      createdAt: brand.createdAt,
    };
  });

  res.status(200).send({
    data: result,
    totalBrands,
    page: Number(myPage),
    limit: myLimit,
  });
});

router.put("/:id", (req, res) => {
  BrandModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((data) => {
      res.status(200).send({ message: "Cập nhật thương hiệu thành công." });
    })
    .catch((err) => {
      res.status(500).send({ message: "Cập nhật thương hiệu thất bại." });
    });
});


router.delete('/delete-many', async (req, res) => {
  try{
    const ids = req.query.idArr;
    await BrandModel.deleteMany({_id: {$in: ids}});
    res.status(200).send({message: 'Xóa nhiều thương hiệu thành công.'})
  }catch(err){
    res.status(500).send({message: "Xóa nhiều thương hiệu thất bại."})
  }
})

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  BrandModel.deleteOne({ _id: id })
    .then(async () => {
      res.status(200).send({ message: "Xóa thương hiệu thành công." });
    })
    .catch((err) =>
      res.status(500).send({ message: "Xóa thương hiệu thất bại." })
    );
});


module.exports = router;
