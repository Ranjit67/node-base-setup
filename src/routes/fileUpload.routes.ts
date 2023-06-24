import { Router } from "express";
import { FileUploadController } from "../controllers";

export default class FileUploadRoute {
  public router: Router;
  private fileUploadController: FileUploadController;
  public path = "file";

  constructor() {
    this.router = Router();
    this.fileUploadController = new FileUploadController();
    this.routes();
  }
  private routes() {
    this.router.post("/file", this.fileUploadController.fileUpload);
  }
}
