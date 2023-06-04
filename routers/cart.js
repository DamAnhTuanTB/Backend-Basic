const express = require("express");
const auth = require("../middlewares/auth");
const mongoose = require("mongoose");

const CartModel = require("../models/cart");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  const productQuery = {
    path: "product",
  };
  const listCart = await CartModel.find({ user: req.user._id }).populate(
    productQuery
  );

  const allowPay = listCart.some((cart) => cart.checked);

  res.status(200).send({
    listCart: listCart.map((cart) => ({
      id: cart._id,
      checked: cart.checked,
      image: cart.product.images[0],
      productName: cart.product.name,
      originPrice: cart.product.originPrice,
      amount: cart.amount,
      totalPrice: cart.amount * cart.product.originPrice,
    })),
    allowPay,
  });
});

router.post("/add-cart", async (req, res) => {
  const { id, amount } = req.body;

  try {
    const product = await CartModel.find({ product: id, user: req.user._id });

    if (product.length === 0) {
      await CartModel.create({
        product: id,
        amount,
        user: req.user._id,
        time: new Date(),
        checked: false,
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

router.put("/update-cart/:id", async (req, res) => {
  const { checked, increase, decrease } = req.body;

  const { id } = req.params;

  const cart = await CartModel.findById(id);

  if (checked === true || checked === false) {
    await CartModel.findOneAndUpdate(
      { _id: id },
      {
        checked,
      }
    );
  }
  if (increase) {
    await CartModel.findOneAndUpdate(
      { _id: id },
      {
        amount: cart.amount + 1,
      }
    );
  }

  if (decrease) {
    if (cart.amount > 1) {
      await CartModel.findOneAndUpdate(
        { _id: id },
        {
          amount: cart.amount - 1,
        }
      );
    }
  }

  const productQuery = {
    path: "product",
  };
  const listCart = await CartModel.find({ user: req.user._id }).populate(
    productQuery
  );

  const allowPay = listCart.some((cart) => cart.checked);
  res.status(200).send({
    listCart: listCart.map((cart) => ({
      id: cart._id,
      checked: cart.checked,
      image: cart.product.images[0],
      productName: cart.product.name,
      originPrice: cart.product.originPrice,
      amount: cart.amount,
      totalPrice: cart.amount * cart.product.originPrice,
    })),
    allowPay,
  });
});

router.post("/buy-now", async (req, res) => {
  const { id, amount } = req.body;

  const product = await CartModel.find({ product: id, user: req.user._id });

  if (product.length === 0) {
    await CartModel.create({
      product: id,
      amount,
      user: req.user._id,
      time: new Date(),
      checked: true,
      user: req.user._id,
    });
  } else {
    await CartModel.findOneAndUpdate(
      { product: id, user: req.user._id },
      { amount: Number(product[0].amount) + Number(amount), checked: true }
    );
  }

  res.status(201).send({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
});

router.delete("/delete-cart/:id", async (req, res) => {
  await CartModel.deleteOne({ _id: req.params.id, user: req.user._id });
  res.status(200).send({
    message: "Xóa sản phẩm khỏi giỏ hàng thành công",
  });
});

module.exports = router;
