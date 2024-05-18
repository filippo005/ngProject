import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
     idReview: {type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}
});

const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
     phoneNumber: String,
     smsOTP: String,
     code: String,
     cartId: {type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
     reviews: [reviewSchema],
     avgReviews: Number
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;