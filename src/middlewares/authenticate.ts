import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token is required"));
  }
  try {
    const parsedToken = token.split(" ")[1];

    const decode = verify(parsedToken, config.jwtSecret as string);
    const _req = req as AuthRequest;
    _req.userId = decode.sub as string;
  
    next();
  } catch (error) {
    return next(createHttpError(401,'Token Expired'))
  }

};
export default authenticate;
