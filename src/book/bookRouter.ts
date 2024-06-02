import express from "express";
import { createBook,updateBook ,getAllBook,getSingleBook,deleteBook} from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";


const bookRouter = express.Router();

// file Store Local
const upload = multer ({
dest:path.resolve(__dirname,"../../public/data/uploads"),
//must remember cloudinary only take 10 mb for upload in free version
limits:{fileSize:2e7}//20mb:20*1024*1024
})


//routes
// /api/books
//create section 
bookRouter.post("/create",authenticate,upload.fields([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}

]),createBook);
//update section
bookRouter.patch("/:bookId/edit",authenticate,upload.fields([
    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}

]),updateBook);

bookRouter.get("/",getAllBook);
bookRouter.get("/:bookId",getSingleBook);
bookRouter.delete("/:bookId",authenticate,deleteBook);



export default bookRouter;
