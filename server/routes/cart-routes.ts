import express from 'express';

const router = express.Router();
const userModel = require("../Schemas/userSchema");
const productModel = require("../Schemas/productSchema");
const cartModel = require("../Schemas/cartSchema");

router.get("/getItems/:idUser", async (req, res) => {
     const idUser = req.params.idUser;
     const user = await userModel.findOne({_id: idUser});
     const cart = await cartModel.findOne({_id: user.cartId});

     const items = await productModel.find({_id: {$in: cart.items}});
     res.json({status: 200, items: items});
});

router.post("/addItem", async (req, res) => {
     const idUser = req.body.idUser;
     const idItem = req.body.idItem;
     const user = await userModel.findOne({_id: idUser});
     const cart = await cartModel.findOne({_id: user.cartId});

     let isItem;
     for(let i = 0; i < cart.items.length; i++){
          if(cart.items[i]._id == idItem){
               isItem = true;
               break;
          }
          else{
               isItem = false;
          }
     }

     if(isItem){
          res.json({status: 400});
     }
     else{
          cart.items.push(idItem);
          //devo salvare il carrello per applicare le modifiche
          await cart.save();
          res.json({status: 200, cartLength: cart.items.length});
     }
});

router.post("/removeItem", async (req, res) => {
     const idUser = req.body.idUser;
     const idItem = req.body.idItem;

     const user = await userModel.findOne({_id: idUser});
     const cart = await cartModel.findOne({_id: user.cartId});

     let index = null;
     for(let i = 0; i < cart.items.length; i++){
          if(cart.items[i]._id == idItem){
               index = i;
               break;
          }
     }

     if(index !== null){
          cart.items.splice(index, 1);
          await cart.save();
          res.json({status: 200, cartLength: cart.items.length});
     }
     else{
          res.json({status: 404});
     }
});

module.exports = router;