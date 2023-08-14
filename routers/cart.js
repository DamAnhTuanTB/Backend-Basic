const express = require("express");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");

const CartModel = require("../models/cart");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const productQuery = {
      path: "product",
    };
    const listCart = await CartModel.find({user: req.user._id}).populate(
      productQuery
    );

    res.status(200).send({
      listCart: listCart?.filter((cart) => !!cart.product)?.map((cart) => ({
        id: cart._id,
        image: cart.product.images[0],
        productName: cart.product.name,
        originPrice: cart.product.originPrice,
        amount: cart.amount,
        totalPrice: cart.amount * cart.product.originPrice,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: "Lỗi server" });
  }
});

router.post("/", async (req, res) => {
  const { id, amount } = req.body;

  try {
    const product = await CartModel.find({ product: id, user: req.user._id });

    if (product.length === 0) {
      await CartModel.create({
        product: id,
        amount,
        user: req.user._id,
        time: new Date(),
        user: req.user._id,
      });
    } else {
      await CartModel.findOneAndUpdate(
        { product: id, user: req.user._id },
        { amount: Number(product[0].amount) + Number(amount) }
      );
    }

    const listCart = await CartModel.find({ user: req.user._id });

    res.status(201).send({ totalCart: listCart.length });
  } catch (err) {
    res.status(500).send({ message: "Lỗi server" });
  }
});

router.put("/:id", async (req, res) => {
  const { amount } = req.body;

  const { id } = req.params;

  try {
    await CartModel.findOneAndUpdate(
      { _id: id },
      {
        amount,
      }
    );
    res.status(200).send({
      message: "Cập nhật thông tin giỏ hàng thành công.",
    });
  } catch (err) {
    res.status(500).send({ message: "Lỗi server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await CartModel.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
    });
  } catch (err) {
    res.status(500).send({
      message: "Lỗi server",
    });
  }
});

router.post('/delete-many', async (req, res) => {
  try{
    await CartModel.deleteMany({ _id: { $in: req.body.listCartId } });
    res.status(200).send({
      message: "Xóa thành công."
    })
  }catch(err){
    res.status(500).send({
        message: "Lỗi server",
      });
    }
})

module.exports = router;
