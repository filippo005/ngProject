import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
     code: String,
     cartId: {type: mongoose.Schema.Types.ObjectId, ref: 'carts'}
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;