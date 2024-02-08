import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const router = express.Router();
const userModel = require("../Schemas/userSchema");

const DBURL = "mongodb+srv://filippo:filippoDB@cluster0.bnlkcki.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DBURL)
.then(data => {console.log("Connected to the DB")})
.catch(err => console.log(err));

router.use(cookieParser());

router.post("/register", async (req, res) => {
     const name = req.body.name;
     const email = req.body.email;
     const password = req.body.password;

     await userModel.findOne({email: email})
     .then((user: any) => {
          if(user){
               res.json({status: res.statusCode});
          }
          else{
               bcrypt.hash(password.toString(), 10, (err, hash) => {
                    if(err) throw err;

                    const values = {
                         name: name,
                         email: email,
                         password: hash
                    };

                    userModel.create(values)
                    .then((user: any) => {})
                    .catch((err: Error) => console.log(err));
               })
          }
     })
});

router.post("/login", async (req, res) => {
     const email = req.body.email;
     const password = req.body.password;

     await userModel.findOne({email: email})
     .then((user: any) => {
          if(user){
               bcrypt.compare(password.toString(), user.password, (err, data) => {
                    if(err) throw err;
                    if(data){
                         const token = jwt.sign({email: user.email}, user._id.toString());
                         res.json({status: 200, name: user.name, email: user.email, token: token});
                    }
                    else{
                         res.json({status: 401});
                    }
               })
          }
          else{
               res.json({status: 401});
          }
     })
});

router.get("/logout", (req, res) => {
     res.json({status: res.statusCode});
});

router.get("/data", async (req, res) => {
     const email = req.body.email;

     await userModel.findOne({email: email})
     .then((user: any) => {
          res.json({name: user.name});
     })
})


module.exports = router;

