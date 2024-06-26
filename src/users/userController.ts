import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //validation
  // if your application has big data u use express validator
  if (!name || !email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }
  //Database call
  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      const error = createHttpError(400, "User already exist with email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while getting user"));
  }

  let newUser: User;
  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Process

    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while Creating user"));
  }
  try {
    //Token generation
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    //Response

    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Doesnot getting JSON webtoken"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return next(
      createHttpError(400, "Make sure fill up the email and password")
    );
  } else if (!email) {
    return next(createHttpError(400, "Make sure fill the email field"));
  } else if (!password) {
    return next(createHttpError(400, "Make sure fill the password field"));
  }
  // check that email exits or not
  let finduser;
  try {
    finduser = await userModel.findOne({ email: email });
    if (!finduser) {
      return next(createHttpError(400, "Invalid User"));
    }
  } catch (error) {
    return next(createHttpError(500, "Error while User is present"));
  }
  try {
    const isMatch = await bcrypt.compare(password, finduser.password);

    if (!isMatch) {
      return next(createHttpError(400, "Invalid User and password"));
    }
  } catch (error) {
    return next(createHttpError(500, "Error while password doesnot match"));
  }
  try {
    //Token generation

    const token = sign({ sub: finduser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });
    res.json({ accessToken: token, message: "the user login sucessfully" });
  } catch (error) {
    return next(createHttpError(500, "Does not getting json web token"));
  }
};
const getAllUsers = async (req:Request,res:Response,next:NextFunction)=>{
  // res.json({message:"get All User data"})

  const AllUsers = await userModel.find();
  res.json({data:AllUsers})

}

export { createUser, loginUser ,getAllUsers};
