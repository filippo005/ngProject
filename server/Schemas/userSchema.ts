import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
     code: String
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;