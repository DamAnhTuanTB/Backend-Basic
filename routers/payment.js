const express = require("express");
const auth = require("../middlewares/auth");

const ProductModel = require('../models/product')

const PaymentModel = require('../models/payment');

const CartModel = require('../models/cart')

const router = express.Router();

router.use(auth);

router.get('/:id', async (req, res) => {
  try{
    const payment = await PaymentModel.findById(req.params.id);
    res.status(200).send({
     data: {
       products: payment.products.map((product) => ({
        id: product.id,
        image: product.image,
        name: product.name,
        amount: product.amount,
        price: product.price
      })),
      totalOriginPrice: payment.totalOriginPrice,
      deliveryPrice: payment.deliveryPrice,
      totalPrice: payment.totalPrice
     }
    })
  }catch(error){
    res.status(500).send({
      message: 'Lỗi server'
    })
  }
})

router.post('/order', async (req, res) => {
  try{
    const listCartId = req.body.listCartId;

    const products = [];

    let totalOriginPrice = 0; 

    listCartId.forEach( async (id, index) => {
      const cart = await CartModel.findOne({_id: id}).populate("product");

      totalOriginPrice += cart.product.salePrice * cart.amount;
      products.push({
        id: cart.product._id,
        name: cart.product.name,
        image: cart.product.images[0],
        amount: cart.amount,
        price: cart.product.salePrice
      })

      if(index === listCartId.length - 1){
        const newOrder = await PaymentModel.create({
          user: req.user._id,
          products,
          totalOriginPrice,
          deliveryPrice: 30000,
          totalPrice: totalOriginPrice + 30000,
          timeUpdate: new Date(),
          listCartId
        })

        res.status(201).send({
          paymentId: newOrder._id
        })
      }
    })
  }catch(error){
    res.status(500).send({
      message: 'Lỗi server'
    })
  }
 
})

router.post("/buy-now", async (req, res) => {
  try{
    const { id, amount } = req.body;

    const product = await ProductModel.findById(id);

    const newOrder = await PaymentModel.create({
      user: req.user._id,
      products: [
        {
          id: product._id,
          name: product.name,
          image: product.images[0],
          amount,
          price: product.salePrice
        }
      ],
      totalOriginPrice: product.salePrice * amount,
      deliveryPrice: 30000,
      totalPrice: product.salePrice * amount + 30000,
      timeUpdate: new Date()
    })

    res.status(201).send({
      paymentId: newOrder._id
    })
  }catch(err){
    res.status(500).send({
      message: 'Lỗi server'
    })
  }

});

module.exports = router;
