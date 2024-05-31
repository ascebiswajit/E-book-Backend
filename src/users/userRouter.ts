import express from "express";
import { createUser,loginUser,getAllUsers } from "./userController";

const userRouter = express.Router();

//routes
userRouter.post("/register",createUser);
userRouter.post("/login",loginUser);
userRouter.get("/",getAllUsers);


export default userRouter;
