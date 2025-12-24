const express = require("express");
const router = require("express").Router();
const auth = require("../middleware/auth");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");


// CREATE ORDER  
router.post("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;   // from JWT

        // Get the cart of logged-in user
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.product.length === 0) {
            return res.status(400).json({ msg: "Cart is empty" });
        }

        // Build order items with price taken from Product model
        let totalAmount = 0;
        let items = [];

        for (let item of cart.product) {
            const product = await Product.findById(item.productId);

            if (!product) continue;

            const price = product.price;
            const quantity = item.quantity;

            totalAmount += price * quantity;

            items.push({
                productId: item.productId,
                quantity,
                price
            });
        }

        // Create order in database
        const newOrder = await Order.create({
            userId,
            items,
            totalAmount,
            paymentMethod: req.body.paymentMethod || "COD"
        });

        // Clear cart
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { product: [] } }
        );

        return res.status(201).json({
            msg: "Order created successfully",
            order: newOrder
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// GET ALL ORDERS OF USER  
router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET ORDER BY ID  
router.get("/:id", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }

        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
