import express from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./book/bookRouter";

import cors from 'cors';
import { config } from "./config/config";
const app = express();
app.use(express.json())

// enable cors origin

// let whitelist = ['http://localhost:5173', 'http://localhost:3000']
// app.use(cors({
//     origin:whitelist,
// }))

//OR
const whitelist = [config.eBook_Dashboard_Url, config.eBook_Client_Url];

const corsOptions = {
    origin: function (origin:any, callback:any) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};


app.use(cors(corsOptions));


//Routes
//HTTPS Methods GET,POST,PUT,PATCH,DELETE

app.get("/", (req, res, next) => {
    //check that the error
    // const error = createHttpError(400,'something wrong')
    // throw error;
    res.json({ message: "THe app is running" });
});

app.use("/api/users/", userRouter);
app.use("/api/books/", bookRouter);

//global error handler
app.use(globalErrorHandler);

export default app;
