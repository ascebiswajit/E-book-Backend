import express from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";
const app = express();

//Routes
//HTTPS Methods GET,POST,PUT,PATCH,DELETE

app.get("/", (req, res, next) => {
    //check that the error
    // const error = createHttpError(400,'something wrong')
    // throw error;
    res.json({ message: "THe app is running" });
});

app.use("/api/users/", userRouter);
//global error handler
app.use(globalErrorHandler);

export default app;
