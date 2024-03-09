import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
     name: String,
     price: Number,
     category: String
});

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;