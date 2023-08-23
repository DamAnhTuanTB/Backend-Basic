const express = require("express");
const auth = require("../middlewares/auth");

const PaymentModel = require('../models/payment');

const OrderModel = require('../models/order');

const TimelineModel = require('../models/timeline');
const CartModel = require("../models/cart");

const router = express.Router();

router.use(auth);

router.get('/:id', async (req, res) => {
  try{
    const order = await OrderModel.findById(req.params.id);
    res.status(200).send({
        data: {
            orderId: order._id,
            orderStatus: order.status,
            methodPayment: order.methodPayment,
            totalPrice: order.totalPrice,
            address: order.address
        }
    })
  }catch(error){
    res.status(500).send({
      message: "Lỗi server"
    })
  }
})

router.post('/', async (req, res) => {
  try{
    const {
        paymentId,
        address,
        noteOrder,
        methodPayment,
        timeDelivery
      } = req.body;
      const payment = await PaymentModel.findById(paymentId);

      payment.listCartId.forEach(async (cartId) => {
        await CartModel.deleteOne({_id: cartId})
      })

      const order = await OrderModel.create({
        user: req.user._id,
        products: payment.products,
        totalOriginPrice: payment.totalOriginPrice,
        deliveryPrice: payment.deliveryPrice,
        totalPrice: payment.totalPrice,
        address,
        methodPayment,
        status: 'processing',
        timeDelivery,
        noteOrder,
        timeUpdate: new Date(),
        createdAt: new Date,
      })

      await TimelineModel.create({
        order: order._id,
        status: 'processing',
        timeUpdate: new Date()
      })

      res.status(200).send({
        orderId: order._id
      })
  }catch(error){
    res.status(500).send({message: 'Lỗi server'})
  }
 
})


module.exports = router;
