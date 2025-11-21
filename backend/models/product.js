//Initializing the model schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the product model schema
const productSchema = new Schema({
    productName:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: false,
    },
    price:{
        type: String,
        required: true,
    },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;