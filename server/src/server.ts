import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const authRouter = require("../routes/auth-routes");

app.use(cors({
     origin: ["http://localhost:4200"],
     methods: ["GET", "POST"],
     credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api", authRouter);

app.listen(8080, () => {
     console.log("server started on 8080 port...");
});