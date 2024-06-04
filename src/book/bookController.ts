import express, { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre,description } = req.body;
  //define the type of req.files
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

  const fileName = files.coverImage[0].filename;

  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "bookCover",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    // for upload pdf
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    // create book
    // @ts-ignore
    console.log("userId", req.userId);

    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      description,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    try {
      // Delete temp file from local
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
    } catch (error) {
      return next(
        createHttpError(500, "there having a problem in   delete local file")
      );
    }

    res
      .status(201)
      .json({ id: newBook._id, message: "The bokk is created sucessfully" });
  } catch (error) {
    return next(
      createHttpError(500, "there having a problem in   upload  cloudinary")
    );
  }
};
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre,description } = req.body;

  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not Found"));
  }
  const _req = req as AuthRequest;

  if (book.author.toString() !== _req.userId) {
    //403 status code used for you are logged in but you have not authorized to do some thing
    return next(createHttpError(403, "You are not authorized"));
  }

  // //define the type of req.files
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";

  if (files.coverImage) {
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const fileName = files.coverImage[0].filename;

    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    completeCoverImage = fileName;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "bookCover",
      format: coverImageMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }
  let completeFileName = "";
  if (files.file) {
    const bookFileName = files.file[0].filename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    completeFileName = bookFileName;
    // for upload pdf
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    completeFileName = bookFileUploadResult.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      description:description,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json({ updatedBook, message: "THe book data updated" });
};

const getAllBook = async (req: Request, res: Response, next: NextFunction) => {
  //add sleep on data fetching
  // const  sleep = await new Promise((resolve)=>setTimeout(resolve,5000))
  try {
    const book = await bookModel.find().populate("author","name");
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting Data"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findOne({ _id: bookId }).populate("author","name email");
    if (!book) {
      return next(createHttpError(404, "Book is not Found"));
    }
    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting Data"));
  }
};


// delete Book
const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findOne({ _id: bookId });


    // check access
    const _req = req as AuthRequest
    if(book?.author.toString() !== _req.userId){
      return next(createHttpError(403,"you don't have access"))
    }
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId = coverFileSplits.at(-2)+'/'+coverFileSplits.at(-1)?.split('.').at(0)
    const BookFileSplits = book.file.split("/");
    const BookFilePublicId = BookFileSplits.at(-2)+'/'+BookFileSplits.at(-1)
    console.log(coverImagePublicId,BookFilePublicId)

    
    await cloudinary.uploader.destroy(coverImagePublicId)
    await cloudinary.uploader.destroy(BookFilePublicId,{
      resource_type:"raw"
    })
    await bookModel.deleteOne({_id:bookId})
    return res.sendStatus(204);
  } catch (error) {
    return next(createHttpError(500,"Error while delete book"))
  }

  }
export { createBook, updateBook, getAllBook, getSingleBook ,deleteBook};
