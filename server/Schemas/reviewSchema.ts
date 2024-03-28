import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
     mark: Number,
     description: String
});

const reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel;