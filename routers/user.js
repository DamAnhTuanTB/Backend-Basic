const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json('Hello');
})

router.post('/', (req, res) => {
    res.json(req.body);
})

module.exports = router;