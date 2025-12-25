const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const User = require("./models/user.model.js");
const UserRoutes = require("./routes/user.routes.js");
const Cart = require("./models/cart.model.js");
const cartRoutes = require("./routes/cart.routes.js");
const Product = require("./models/product.model.js");
const productRouter = require("./routes/product.routes.js");
const Category = require("./models/category.model.js");
const categoryRouter = require("./routes/category.routes.js");
const Admin = require("./models/admin.model.js");
const adminRouter = require("./routes/admin.routes.js");
const Order = require("./models/order.model.js");
const orderRoutes = require("./routes/order.routes.js");
const { MulterError } = require("multer");


mongoose.connect('mongodb+srv://combineemail92_db_user:Ecommerce%40123@cluster0.nbjuooz.mongodb.net/?appName=Cluster0',)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});
const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));


app.use('/users', UserRoutes);
app.use('/cart', cartRoutes);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/admin', adminRouter);
app.use('/orders', orderRoutes);

app.use((err, req, res, next) => {
    if(err instanceof MulterError) {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
    next();
});

app.get('/', (req, res) => {
    app.res('hello world')
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");

});
