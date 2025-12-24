const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/cart.model");



router.get("/", auth, async (req, res) => {
  const cart = await Cart.find();
  res.json(cart);
});

router.get("/:id", auth, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
  const cart_obj = await Cart.create(req.body);
  res.status(201).json(cart_obj);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Make sure cart exists for this user
    let cart = await Cart.findOne({ userId });

    // If no cart exists → create one
    if (!cart) {
      cart = await Cart.create({
        userId,
        product: [{ productId, quantity }]
      });
      return res.json(cart);
    }

    // If cart exists → push new product
    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        $push: { product: { productId, quantity } }
      },
      { new: true }
    );

    res.json(updatedCart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { product: { productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({
      message: "Product removed successfully",
      cart: updatedCart
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



 


module.exports = router;
