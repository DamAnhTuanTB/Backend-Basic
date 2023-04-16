const express = require('express');
const auth = require('../middlewares/auth');

const AddressModel = require('../models/address');

const router = express.Router();

// router.use(auth);

router.get('/', (req, res) => {
  AddressModel.find({ user: req.user._id }).then(data =>
    res.status(200).send({
      data: data.map(item => ({
        name: item.name,
        telephone: item.telephone,
        email: item.email,
        address: item.address,
        isDefault: item.isDefault
      })
      )
    })
  )
    .catch(err => {
      res.status(500).send({
        message: "Lỗi server"
      })
    })
})

router.get('/:id', (req, res) => {
  AddressModel.findOne({ _id: req.params.id }).then(data => {
    res.status(200).send({
      data: {
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        address: data.address,
        isDefault: data.isDefault
      }
    })
  }).catch(() => res.status(500).send({ message: "Lỗi server" }))
})

router.post('/', (req, res) => {
  const data = req.body;
  AddressModel.create({
    user: req.user._id,
    ...data
  }).then(data => {
    res.status(201).send({
      message: "Thêm địa chỉ mới thành công"
    })
  })
})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  AddressModel.findOneAndUpdate({ _id: id }, data).then(() => {
    res.status(200).send({ message: "Cập nhật thành công." })
  }).catch(err => res.status(500).send({ message: "Lỗi server" }))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  AddressModel.deleteOne({ _id: id }).then(() => res.status(200).send({ message: "Xóa địa chỉ thành công." }))
    .catch(err => res.status(500).send({ message: "Lỗi server" }))
})

module.exports = router;