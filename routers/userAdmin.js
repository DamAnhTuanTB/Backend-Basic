const express = require('express');
// const auth = require('../middlewares/auth');

const UserModel = require('../models/user');

const OrderModel = require('../models/order')

const router = express.Router();

// router.use(auth);

router.get('/', async (req, res) => {

    let { keyword, page, limit, sort } = req.query;

    const myPage = page || 1;

    const myLimit = limit || 12;

    const queryUser = {};
    if (keyword) {
        queryUser.name = { $regex: keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' }
    }

    const totalUsers = await UserModel.countDocuments(queryUser);

    const users = await UserModel.find(queryUser).skip((myPage - 1) * myLimit).limit(myLimit);

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

    result.sort((a, b) => a.name - b.name);

    if(Number(sort) === 0){
        result.sort((a, b) => b.totalMoney - a.totalMoney)
    }else if(Number(sort) === 1){
        result.sort((a, b) => a.totalMoney - b.totalMoney)
    }

    res.status(200).send({
        data: result,
        totalUsers,
        page: Number(myPage),
        limit: myLimit
    })
})

router.get('/:id', async (req, res) => {
    let { id } = req.params;
    
})


module.exports = router;
