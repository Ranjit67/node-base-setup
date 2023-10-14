"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
class FileUploadRoute {
    constructor() {
        this.path = "file";
        this.router = (0, express_1.Router)();
        this.fileUploadController = new controllers_1.FileUploadController();
        this.routes();
    }
    routes() {
        this.router.post("/file", this.fileUploadController.fileUpload);
    }
}
exports.default = FileUploadRoute;
