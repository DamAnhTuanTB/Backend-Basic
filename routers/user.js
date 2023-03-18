const express = require('express');
const auth = require('../middlewares/auth');

const UserModel = require('../models/user');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    let user = req.user;
    let objUser = {
        name: user.name,
        telephone: user.telephone,
        date: user.date,
        gender: user.gender,
        address: user?.address,
        identification: user?.identification,
    }
    res.status(200).send({ user: objUser });
})

router.put('/', (req, res) => {
    if (req.body.email || req.body.password) {
        res.status(400).send({ message: 'Vui lòng gửi đúng dữ liệu' })
    }
    UserModel.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
        .then(data => {
            res.status(200).send({ message: "Cập nhật thành công." })
        })
        .catch(err => {
            res.status(500).send({ message: "Lỗi server." })
        })
})

module.exports = router;