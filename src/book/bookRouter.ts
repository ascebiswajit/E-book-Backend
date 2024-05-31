import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";


const bookRouter = express.Router();

// file Store Local
const upload = multer ({
dest:path.resolve(__dirname,"../../public/data/uploads"),
limits:{fileSize:3e7}//30mb:30*1024*1024
})


//routes
// /api/books
bookRouter.post("/create",upload.fields([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}

]),createBook);


export default bookRouter;
