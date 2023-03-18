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
            res.redirect('/login');
        })
    } catch (error) {
        // res.status(401).json({message: "Vui lòng đăng nhập để tiếp tục"});
        res.redirect('/login');
    }
}

module.exports = auth