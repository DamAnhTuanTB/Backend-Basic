const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, 'mk');
        UserModel.findOne({
            _id: data._id
        }).then(data => {
            req.user = data;
            next();
        }).catch(err => {
            res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục" });
        })
    } catch (error) {
        // res.status(401).json({message: "Vui lòng đăng nhập để tiếp tục"});
        res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục" });
    }
}

module.exports = auth