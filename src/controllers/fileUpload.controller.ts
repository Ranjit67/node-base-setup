import { NextFunction, Request, Response } from "express";
import { MediaStoreService } from "../services";

export default class FileUploadController {
  async fileUpload(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req?.files?.file;
      const data = await new MediaStoreService().upload({
        file,
        dir: "PRACTICE/IMAGE",
      });
      //   console.log(file);
      //   if(!data) throw new Error("error")
      res.json({
        success: {
          data: data,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
