//initializing Server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const {DB_URI} = process.env;
const cors = require("cors");
const Product = require("./models/product");

// middleware
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cors());

//Database connection and server listneing
mongoose.connect(DB_URI).then(() => {
    server.listen(port, () => {
        console.log(`Database is connected\nServer is listening on ${port}`);
    });
}).catch((error) => console.log(error.message));

//routes
//root route
server.get("/", (request, response) => {
    response.send("Server is Live!");
});

//to Get all the data from products collection
server.get("/products", async (request, response) => {
    try{
        const products = await Product.find();
        response.send(products);
    } catch(error) {
        response.status(500).send({message: error.message});
    }
});
// to POST a new product to DB
server.post("/products", async (request, response) => {
    const {productName, brand, image, price} = request.body;
    const newProduct = new Product({
        productName,
        brand,
        image,
        price,
    });
    try {
        await newProduct.save();
        response.status(200).send({message: `Product is added successfully! ${crypto.randomUUID()}`})
    } catch(error){
        response.status(400).send({message: error.message})
    }
});

//to DELETE a product from DB by its ID
server.delete("/products/:id", async (request, response) => {
    const { id } = request.params;
    try{
        await Product.findByIdAndDelete(id);
        response.send({ message: `Product is deleted with ${id}!`})
    } catch(error){
        response.status(400).send({message: error.message});
    }
});

// to GET one product from DB by its ID
server.get("/products/:id", async (request, response) => {
    const { id } = request.params;
    try{
        const productToEdit = await Product.findById(id);
        response.send(productToEdit);
    } catch(error){
        response.status(500).send({message: error.message});
    }
})

//to PATCH a product by id
server.patch("/products/:id", async (request, response) => {
    const { id } = request.params;
    const {productName, brand, image, price} = request.body;
    try{
        await Product.findByIdAndUpdate(id, {
            productName,
            brand,
            image,
            price,
        });
        response.send({message: `Product has been updated with the id: ${id}`})
    } catch(error){
    response.status(500).send({message:error.message})
    };
});
