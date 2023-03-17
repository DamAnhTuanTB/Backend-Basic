const express = require('express');
const auth = require('../middlewares/auth');

const UserModel = require('../models/user');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
    res.status(200).send(req.user);
})

module.exports = router;