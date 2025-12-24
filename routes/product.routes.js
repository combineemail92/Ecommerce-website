const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product.model');

// Get all products

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// get single product

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
})

// get product by category

router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;