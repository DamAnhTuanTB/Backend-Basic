const express = require('express');
const auth = require('../middlewares/auth');

const EvaluateModel = require('../models/evaluate');

const router = express.Router();

// router.use(auth);

router.post('/', (req, res) => {
  EvaluateModel.create(req.body).then(data => {
    res.status(200).send({
      message: "Tao danh gia thanh cong"
    })
  })
})


module.exports = router;