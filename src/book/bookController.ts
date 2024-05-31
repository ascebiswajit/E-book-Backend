import express, { NextFunction, Request, Response } from 'express';
const createBook= (req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"the book is created"})
}

export {createBook};