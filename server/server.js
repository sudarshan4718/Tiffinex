import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import providerRouter from "./routes/providerRoutes.js";



const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({credentials: true}));


app.get("/", (req, res) => {
    res.send("Welcome to Tiffinex API");    
});

app.use('/api/user',userRouter)
app.use('/api/provider', providerRouter);

app.listen(port, ()=> {
    console.log(`Server started on port : ${port}`);
});

