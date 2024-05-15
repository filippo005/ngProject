import express from 'express';

const router = express.Router();
const stripe = require('stripe')('sk_test_51N9B2OILKoaPpOnPoEF2iKNmDj3Eadk406IibPGFIKKl4wdJHkXr1eYFxeYB8hiOjfKiQhQJsG5mVZTG4gDQ8HeU00qiZBU977');


// var charge = await stripe.charges.retrieve(
//      'ch_3LiiC52eZvKYlo2C1da66ZSQ',
//      {
//        apiKey: 'sk_test_51N9B2OILKoaPpOnPoEF2iKNmDj3Eadk406IibPGFIKKl4wdJHkXr1eYFxeYB8hiOjfKiQhQJsG5mVZTG4gDQ8HeU00qiZBU977'
//      }
// );

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

     let index: any = null;
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

router.post("/pay", async (req, res) => {
     const payment = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: req.body.items.map((item: any) => {
               return{
                    price_data: {
                         currency: 'usd',
                         product_data: {
                              name: item.name
                         },
                         unit_amount: item.price * 100
                    },
                    quantity: item.quantity
               }
          }),
          success_url: `http://localhost:4200/successPayment/${req.body.idUser}`,
          cancel_url: "http://localhost:4200/cart"
     });

     if(payment){
          res.json({status: 200, url: payment.url});
     }else{
          res.json({status: 400});
     }
});

router.post("/emptyCart", async (req, res) => {
     const idUser = req.body.idUser;
     const user = await userModel.findOne({_id: idUser});

     if(user){
          const cart = await cartModel.findOne({_id: user.cartId});
          if(cart){
               cart.items = [];
               await cart.save();
               res.json({status: 200});
          }
          else{
               res.json({status: 400, error: "Carrello non recuperato"});
          }
     }
     else{
          res.json({status: 400, error: "Utente non recuperato"});
     }
});

module.exports = router;