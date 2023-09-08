const express = require("express");
const auth = require("../middlewares/auth");

const PaymentModel = require('../models/payment');

const OrderModel = require('../models/order');

const TimelineModel = require('../models/timeline');
const CartModel = require("../models/cart");

const router = express.Router();

router.use(auth);

router.get('/list-order', async (req, res) => {
  try{
    const listOrders = await OrderModel.find({user: req.user._id}).lean();
      res.status(200).send({
        data: listOrders
      })
  }catch(err){
    res.status(500).send({
      message: 'Lỗi server.'
    })
  }
})

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

router.get('/detail/:id', async (req, res) => {
  try{
    const orderDetail = await OrderModel.findById(req.params.id).lean();

    const timelineCurrent = await TimelineModel.find({
      order: req.params.id,
    }).sort({ timeUpdate: -1 });

    const timelineDetail = timelineCurrent.map((item) => ({
      status: item.status,
      timeUpdate: item.timeUpdate,
    }))

    res.status(200).send({
      data: {
        ...orderDetail,
        timelineDetail
      }
    })
  }catch(err){
    res.status(500).send({
      message: 'Lỗi server.'
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
        createdAt: new Date(),
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
