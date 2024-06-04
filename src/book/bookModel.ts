import mongoose from "mongoose";
import { Book } from "./bookTypes";
import userModel from "../users/userModel";
const bookSchema = new mongoose.Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  coverImage:{
    type:String,
    required:true,
  },
  file:{
    type:String,
    required:true,

  },
  genre:{
    type:String,
    required:true
  }
},{timestamps:true});

const bookModel = mongoose.model<Book>("Book", bookSchema);
export default bookModel;
