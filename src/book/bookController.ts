import express, { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
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
      console.log("userId",req.userId)
      
    const newBook = await bookModel.create({
      title,
      genre,
      author: "6659bf852dda11f47486f1b3",
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

export { createBook };
