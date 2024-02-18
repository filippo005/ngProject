import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: 'filippo.fili2005@gmail.com',
          pass: 'edvehyaanedtkypb'
     }
});


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
               res.json({status: 400});
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

                    res.json({status: 200});
               });
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
                         const token = jwt.sign({id: user._id.toString()}, user._id.toString());
                         res.json({status: 200, id: user._id.toString(), name: user.name, email: user.email, token: token});
                    }
                    else{
                         res.json({status: 400});
                    }
               })
          }
          else{
               res.json({status: 400});
          }
     })
});

router.post("/updateName", async (req, res) => {
     const filter = {_id: req.body.id};

     const result = await userModel.updateOne(filter, {$set: {name: req.body.data}});

     if(result){
          res.json({status: res.statusCode});
     }
});

router.post("/updateEmail", async (req, res) => {
     const user = await userModel.findOne({email: req.body.data});
     if(!user){
          const filter = {_id: req.body.id};

          const result = await userModel.updateOne(filter, {$set: {email: req.body.data}});

          if(result.modifiedCount == 1){
               res.json({status: 200, message: "Email aggiornata"});
          }
     }
     else{
          res.json({status: 400});
     }
});

router.get("/data/:id", async (req, res) => {
     await userModel.findOne({_id: req.params.id})
     .then((user: any) => {
          res.json({name: user.name, email: user.email});
     })
});

router.post("/sendEmail", async (req, res) => {
     const user = await userModel.findOne({email: req.body.email});

     if(user){
          let mailOptions = {
               from: "filippo.fili2005@gmail.com",
               to: req.body.email,
               subject: "Reimpostare password",
               html:`
               <div>
                    <p>
                         Per reimpostare la tua passwrd clicca qui
                         <span>
                              <a href="http://localhost:4200/resetPassword/${user._id}">
                                   <button>Reimposta Password</button>
                              </a>
                         </span>
                    </p>
               </div>
               `
          };

          transporter.sendMail(mailOptions, (err, data) => {
               if(err){
                    res.json({status: 500});
               }
               else{
                    res.json({status: 200});
               }
          });
     }
     else{
          res.json({status: 400});
     }
});

router.post('/resetPassword', (req, res) => {
     const filter = {_id: req.body.id};

     bcrypt.hash(req.body.password.toString(), 10, async (err, hash) => {
          const result = await userModel.updateOne(filter, {$set: {password: hash}});

          if(err){
               res.json({status: 500});
          }
          else if(result.modifiedCount == 1){
               res.json({status: 200});
          }
     });
});


module.exports = router;

