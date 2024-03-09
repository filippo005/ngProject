import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
     productId: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
     quantity: Number
});

const cartSchema = new mongoose.Schema({
     items: [cartItemSchema]
});

const cartModel = mongoose.model("carts", cartSchema);
module.exports = cartModel;