const express = require('express');

const AccountModel = require('../models/account');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json('Hello');
})

router.post('/', (req, res) => {
    AccountModel.create({
        username: req.body.username,
        password: req.body.password
    }).then(data => {
        res.json('Tao thanh cong')
    }).catch(err => {
        res.status(500).json('Loi server')
    })
})

module.exports = router;