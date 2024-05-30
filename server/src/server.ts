import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();

const authRouter = require("../routes/auth-routes");
const productRouter = require("../routes/product-routes");
const cartRouter = require("../routes/cart-routes");

app.use(cors({
     origin: ["https://ng-project.vercel.app"],
     methods: ["GET", "POST"],
     credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const DBURL = "mongodb+srv://filippo:filippoDB@cluster0.bnlkcki.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DBURL)
.then(data => {console.log("Connected to the DB")})
.catch(err => console.log(err));

app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api/cart", cartRouter);

app.listen(8080, () => {
     console.log("server started on 8080 port...");
});