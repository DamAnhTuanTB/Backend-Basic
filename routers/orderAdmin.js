const express = require("express");
// const auth = require('../middlewares/auth');

const OrderModel = require("../models/order");

const router = express.Router();

// router.use(auth);
 
router.get("/", async (req, res) => {
  // -1: giảm dần
  // 1: tăng dần
  // 0: Mặc định
  let { keyword, sortMoney, startDate, endDate, orderStatus, methodPayment, page, limit} = req.query;

  sortMoney = Number(sortMoney);

  const myPage = Number(page) || 1;

  const myLimit = Number(limit) || 12;

  const conditions = {};

  const dateCondition = {};

  const sortCondition = {};

  if(sortMoney){
    sortCondition.totalPrice = sortMoney;
  }

  const myKeyword = keyword || '';

  if(startDate){
    dateCondition.$gte = new Date(startDate);
  }

  if(endDate){
    dateCondition.$lte = new Date(endDate);
  }

  if(JSON.stringify(dateCondition) !== '{}'){
    conditions.createdAt = dateCondition
  }

  if(orderStatus){
    conditions.status = orderStatus
  }

  if(methodPayment){
    conditions.methodPayment = methodPayment;
  }

  const results = await OrderModel.find(conditions).sort(sortCondition).populate(
    {
      path: 'user', 
      match: {
        $or: [
          {
            name: 
              {
                $regex: myKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i'
              }
          },
          {
            email: 
              {
                $regex: myKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i'
              }
          }
        ]
      }
    }
  )

  const filterResults = results.filter(order => order.user);

  const startIndex = (myPage - 1)*myLimit;
  const endIndex = startIndex + myLimit;

  const totalOrders = filterResults.length;

  const response = filterResults.slice(startIndex, endIndex).map((item) => ({
    orderId: item._id,
    userInfo: {
      id: item.user._id,
      name: item.user.name,
      email: item.user.email,
      telephone: item.user.telephone,
      date: item.user.date,
      gender: item.user.gender
    },
    productsInfo: item.products.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      amount: product.amount,
      price: product.price
    })),
    totalOriginPrice: item.totalOriginPrice,
    deliveryPrice: item.deliveryPrice,
    totalPrice: item.totalPrice,
    methodPayment: item.methodPayment,
    orderStatus: item.status,
    noteOrder: item.noteOrder,
    createdAt: item?.createdAt
  }))

  res.status(200).send({
        data: response,
        totalOrders,
        page: Number(myPage),
        limit: Number(myLimit)
  })
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  OrderModel.findOneAndUpdate({ _id: id }, {status: req.body.orderStatus})
    .then(() => {
      res.status(200).send({ message: "Cập nhật trạng thái đơn hàng thành công." });
    })
    .catch((err) =>
      res.status(500).send({ message: "Cập nhật trạng thái đơn hàng thất bại." })
    );
});

module.exports = router;
