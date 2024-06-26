import express from 'express';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import otp from 'otp-generator';
import { ObjectId } from 'mongoose';

let transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: 'filippo.fili2005@gmail.com',
          pass: 'edvehyaanedtkypb'
     }
});

const accountSid = 'ACff583b68cd89fab6979d5787e005f7a4';
const authToken = 'ccc4adf63969dfa409bd3fb4a087a7c0';
const client = require('twilio')(accountSid, authToken);


const router = express.Router();
const userModel = require("../Schemas/userSchema");
const cartModel = require("../Schemas/cartSchema");

router.use(cookieParser());

router.post("/register", async (req, res) => {
     const name = req.body.name;
     const email = req.body.email;
     const password = req.body.password;
     const phoneNumber = req.body.phoneNumber;

     await userModel.findOne({email: email})
     .then((user: any) => {
          if(user){
               res.json({status: 400});
          }
          else{
               bcrypt.hash(password.toString(), 10, (err, hash) => {
                    if(err) throw err;

                    let cartId: ObjectId;

                    cartModel.create({items: []})
                    .then((cart: any) => {
                         cartId = cart._id;

                         const values = {
                              name: name,
                              email: email,
                              password: hash,
                              phoneNumber: "",
                              smsOTP: "",
                              code: "",
                              cartId: cartId,
                              avgReviews: 0
                         };

                         userModel.create(values)
                         .then((user: any) => {
                              user.reviews = [];
                         })
                         .catch((err: Error) => console.log(err));
                    })
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
     const filter = {_id: req.body.idUser};

     const result = await userModel.updateOne(filter, {$set: {name: req.body.name}});

     if(result){
          res.json({status: 200});
     }
     else{
          res.json({status: 400});
     }
});

router.post("/updateEmail", async (req, res) => {
     const user = await userModel.findOne({email: req.body.data});

     if(!user){
          const filter = {_id: req.body.idUser};

          const result = await userModel.updateOne(filter, {$set: {email: req.body.email}});

          if(result.modifiedCount == 1){
               res.json({status: 200});
          }
     }
     else{
          res.json({status: 400});
     }
});

router.post('/updatePhoneNumber', async (req, res) => {
     const prefix = req.body.prefix;
     const number = req.body.phoneNumber;
     const idUser = req.body.idUser;
     const phoneNumber = `${prefix}${number}`;
     const OTP = otp.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true});
     const filter = {_id: idUser};

     const result = await userModel.updateOne(filter, {$set: {phoneNumber: phoneNumber}});

     if(result){
          const insertCode = await userModel.updateOne(filter, {$set: {smsOTP: OTP}});
          if(insertCode){
               client.messages
               .create({
                    body: `Inserisci questo codice OTP per verificare il tuo numero di telefono: ${OTP}`,
                    from: '+12176263523',
                    to: `${phoneNumber}`
               })
               .then(() => {
                    res.json({status: 200});
               })
               .catch((error: any) => {
                    res.json({status: 400});
               });
          }
     }
     else{
          res.json({status: 400});
     }
});

router.get("/data/:id", async (req, res) => {
     await userModel.findOne({_id: req.params.id})
     .then((user: any) => {
          res.json({name: user.name, email: user.email, phoneNumber: user.phoneNumber});
     });
});

router.post("/sendEmail", async (req, res) => {
     const user = await userModel.findOne({email: req.body.email});

     if(user){
          const OTP = otp.generate(8, {lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false, digits: true});
          let mailOptions = {
               from: "filippo.fili2005@gmail.com",
               to: req.body.email,
               subject: "Reimpostare password",
               html:`
               <div>
                    <p>Ecco il codice OTP da inserire per reimpostare la tua password</p>
                    <b>${OTP}</b>
               </div>
               `
          };

          bcrypt.hash(OTP.toString(), 10, async (err, hash) => {
               if(err) throw err;

               await userModel.updateOne({email: req.body.email}, {$set: {code: hash}});
          });

          transporter.sendMail(mailOptions, (err, data) => {
               if(err){
                    res.json({status: 500});
               }
               else{
                    res.json({status: 200, id: user._id});
               }
          });
     }
     else{
          res.json({status: 400});
     }
});

router.post('/controlOTP', async (req, res) => {
     const OTP = req.body.otp;
     const user = await userModel.findOne({_id: req.body.id});

     bcrypt.compare(OTP.toString(), user.code, (err, data) => {
          if(err) throw err;

          if(data){
               res.json({status: 200});
          }
          else{
               res.json({status: 400});
          }
     })
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

router.post('/verifySmsOTP', async (req, res) => {
     const code = req.body.code;
     const idUser = req.body.idUser;

     const user = await userModel.findOne({_id: idUser});

     if(user){
          if(user.smsOTP == code){
               res.json({status: 200});
          }
          else{
               res.json({status: 400});
          }
     }
});

module.exports = router;

