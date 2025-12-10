const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    product :[
        {
        productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                    required: true,
                },
        quantity: {
                    type: Number,
                    required: true,
                } 
        }        
    ] 
});

module.exports = mongoose.model("Cart", cartSchema);