import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //validation
  // if your application has big data u use express validator
  if (!name || !email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }
  //Database call
  const user = await userModel.findOne({ email: email });

  if (user) {
    const error = createHttpError(400, "User already exist with email");
    return next(error);
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password,10)
  
  //Process

  //Response

  res.json({ message: "User registered" });
};

export { createUser };
