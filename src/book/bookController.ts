import express, { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);
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
console.log(uploadResult,'uploadResult')

  } catch (error) {
    return next(createHttpError(500,'the coverimage is not upload in cloudinary'))
  }




  const bookFileName = files.file[0].filename;

  const bookFilePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    bookFileName
  );
try {
      // for upload pdf 
  const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
    resource_type:'raw',
    filename_override:bookFileName,
    folder:'book-pdfs',
    format:'pdf',
  })
console.log(bookFileUploadResult,'uploadPdfResult')

} catch (error) {
    return next(createHttpError(500,'the bookPdf is not upload in cloudinary'))

}

  res.json({});
};

export { createBook };
