const express = require('express');
// const auth = require('../middlewares/auth');

const UserModel = require('../models/user');

const OrderModel = require('../models/order');

const PaymentModel = require('../models/payment');

const EvaluateModel = require('../models/evaluate')

const CartModel = require("../models/cart");

const bcrypt = require("bcryptjs");

const router = express.Router();

// router.use(auth);

router.post("/", async (req, res) => {
  try {
    let { name, date, email, password, telephone, gender } = req.body;
    if (!name || !date || !email || !telephone || !gender || !password) {
      return res
        .status(400)
        .send({ message: "Vui lòng gửi đầy đủ thông tin." });
    }
 
    const checkUnique = await UserModel.checkUniqueUser(email, telephone);
    if (checkUnique) {
      return res.status(400).send(checkUnique);
    }

    req.body.password = await bcrypt.hash(req.body.password, 8);

    UserModel.create(req.body)
      .then(() => {
        res.status(201).send({ message: "Tạo tài khoản khách hàng thành công." });
      })
      .catch((error) => {
        let errObject = {};
        for (key in error.errors) {
          errObject[key] = error.errors[key].message;
        }
      });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server" });
  }
});

router.get('/', async (req, res) => {

    let { keyword, page, limit, sort } = req.query;

    const myPage = page || 1;

    const myLimit = limit || 10;

    const queryUser = {role: { $ne: 'admin' }};
    
    if (keyword) {
        queryUser.name = { $regex: keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' }
    }

    const totalUsers = await UserModel.countDocuments(queryUser);

    const startIndex = (myPage - 1)*myLimit;
    const endIndex = startIndex + myLimit;

    const users = await UserModel.find(queryUser).sort({name: 1});

    const usersWithOrders = await OrderModel.aggregate([
        {
            $group: {
               _id: "$user",
                totalSpent: { $sum: "$totalPrice" },
            },
        }
    ]);

    const result = users.map(user => {
        const orderInfo = usersWithOrders.find(order => order._id.equals(user._id));
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            date: user.date,
            telephone: user.telephone,
            gender: user.gender,
            totalMoney: orderInfo ? orderInfo.totalSpent : 0
        };
    });

    if(Number(sort) === 0){
        result.sort((a, b) => b.totalMoney - a.totalMoney)
    }else if(Number(sort) === 1){
        result.sort((a, b) => a.totalMoney - b.totalMoney)
    }

    res.status(200).send({
        data: result.slice(startIndex, endIndex),
        totalUsers,
        page: Number(myPage),
        limit: myLimit
    })
})

router.put('/:id', (req, res) => {
    if (req.body.email || req.body.password) {
        res.status(400).send({ message: 'Vui lòng gửi đúng dữ liệu' })
    }
    UserModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(data => {
            res.status(200).send({ message: "Cập nhật thông tin cá nhân thành công." })
        })
        .catch(err => {
            res.status(500).send({ message: "Lỗi server." })
        })
})

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  UserModel.deleteOne({ _id: id })
    .then(async () => {
        await OrderModel.deleteMany({ user: id });
        await PaymentModel.deleteMany({user: id});
        await CartModel.deleteMany({user: id});
        await EvaluateModel.deleteMany({user: id});
        res.status(200).send({ message: "Xóa khách hàng thành công." })} )
    .catch((err) => res.status(500).send({ message: "Xóa khách hàng thất bại" }));
});



module.exports = router;
