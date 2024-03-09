import express from 'express';

const router = express.Router();
const productModel = require('../Schemas/productSchema');

router.post("/registerProduct", async (req, res) => {
     const data = req.body;

     productModel.create(data)
     .then((data: any) => {})
     .catch((err: any) => console.log(err));
     res.json({status: 200});
});

router.get("/getProducts", async (req, res) => {
     const result = await productModel.find();

     if(result){
          res.json({status: 200, products: result});
     }
     else{
          res.json({status: 404});
     }
});

module.exports = router;