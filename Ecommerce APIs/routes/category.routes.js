const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = require('../models/category.model');


// get all Category

router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});


module.exports = router;