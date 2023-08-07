const express = require('express');
const bcrypt = require("bcryptjs");
const auth = require('../middlewares/auth');

const UserModel = require('../models/user');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    let user = req.user;
    let objUser = {
        name: user.name,
        telephone: user.telephone,
        email: user.email,
        date: user.date
    }
    res.status(200).send({ user: objUser });
})

router.put('/', (req, res) => {
    if (req.body.email || req.body.password) {
        res.status(400).send({ message: 'Vui lòng gửi đúng dữ liệu' })
    }
    UserModel.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
        .then(data => {
            res.status(200).send({ message: "Cập nhật thông tin cá nhân thành công." })
        })
        .catch(err => {
            res.status(500).send({ message: "Lỗi server." })
        })
})

router.put('/forget-password', async (req, res)  => {
    const password = await bcrypt.hash(req.body.password, 8);
         UserModel.findOneAndUpdate({ _id: req.user._id }, {password}, { new: true })
        .then(data => {
            res.status(200).send({ message: "Đổi mật khẩu thành công." })
        })
        .catch(err => {
            res.status(500).send({ message: "Lỗi server." })
        })

})

module.exports = router;
