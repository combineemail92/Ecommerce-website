const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const path = require('path'); 
const Admin = require('../models/admin.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const auth = require('../middleware/adminAuth');

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);

  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage ,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10
  }
})


// register Admin 

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        res.status(201).json(admin);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// login Admin

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id , name : admin.name}, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create a product

router.post ('/products',auth, upload.single('image'), async (req, res) => {
    try {
        const product = new Product(req.body);
        if (req.file) {
            product.image = req.file.filename;
        }
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


//update a pruoduct

router.put('/products/:id',auth,upload.single('image'), async (req, res) => {
    try {
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            if(req.file.filename){
                const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
                fs.unlinkSync(imagePath);
            }
            return res.status(404).json({ error: 'Product not found' });
        }
        if(req.file){
           if(existingProduct.image){
            const imagePath = path.join(__dirname, '..', 'uploads', existingProduct.image);
            fs.unlinkSync(imagePath);
           }
           req.body.image = req.file.filename;
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// create a category

router.post('/categories',auth, async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// delete a product

router.delete('/products/:id',auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if(product.image){
            const imagePath = path.join(__dirname, '..', 'uploads', product.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;