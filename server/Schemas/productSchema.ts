import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
     idReview: {type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}
});

const productSchema = new mongoose.Schema({
     name: String,
     price: Number,
     category: String,
     avgReviews: Number,
     reviews: [reviewSchema]
});

const productModel = mongoose.model('products', productSchema);
module.exports = productModel;