import express from 'express';

const router = express.Router();
const userModel = require("../Schemas/userSchema");
const productModel = require('../Schemas/productSchema');
const reviewModel = require('../Schemas/reviewSchema');

router.get("/getProducts", async (req, res) => {
     const result = await productModel.find();

     if(result){
          res.json({status: 200, products: result});
     }
     else{
          res.json({status: 404});
     }
});

router.get("/getProduct/:idProduct", async (req, res) => {
     const product = await productModel.findOne({_id: req.params.idProduct});

     if(product){
          res.json({status: 200, product: product});
     }
     else{
          res.json({status: 400});
     }
});

router.post("/registerProduct", async (req, res) => {
     const name = req.body.name;
     const price = req.body.price;
     const category = req.body.category;

     const data = {
          name: name,
          price: price,
          category: category,
          avgReviews: 0
     }

     productModel.create(data)
     .then((data: any) => {
          data.reviews = [];
     })
     .catch((err: any) => console.log(err));
     res.json({status: 200});
});

router.post("/addReview", async (req, res) => {
     const idUser = req.body.idUser;
     const idProduct = req.body.idProduct;

     const data = {
          mark: req.body.mark,
          description: req.body.description
     }

     const user = await userModel.findOne({_id: idUser});
     const product = await productModel.findOne({_id: idProduct});

     reviewModel.create(data)
     .then(async (review: any) => {
          user.reviews.push(review._id);
          let total = 0;
          for(const idReview of user.reviews){
               const review = await reviewModel.findOne({_id: idReview});
               total += review.mark;
          }
          let avg = Math.round(total / user.reviews.length);

          await userModel.updateOne({_id: idUser}, {$set: {avgReviews: avg}});
          await user.save();

          product.reviews.push(review._id);
          total = 0;
          avg = 0;
          for(const idReview of product.reviews){
               const review = await reviewModel.findOne({_id: idReview});
               total += review.mark;
          }

          avg = total / product.reviews.length;
          const decimal = avg % 1;

          if(decimal > 0.5){
               avg = Math.ceil(avg);
          }
          else if(decimal < 0.5){
               avg = Math.floor(avg);
          }
          else if(decimal == 0.5){
               avg = avg;
          }

          await productModel.updateOne({_id: idProduct}, {$set: {avgReviews: avg}})
          await product.save();

          res.json({status: 200});
     })
     .catch((err: Error) => {
          console.log(err);
          res.json({status: 400});
     });
});

module.exports = router;