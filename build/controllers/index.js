"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllerValidation = exports.UserController = exports.FileUploadController = exports.AuthController = exports.AuthControllerValidation = void 0;
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "AuthControllerValidation", { enumerable: true, get: function () { return auth_controller_1.AuthControllerValidation; } });
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var fileUpload_controller_1 = require("./fileUpload.controller");
Object.defineProperty(exports, "FileUploadController", { enumerable: true, get: function () { return __importDefault(fileUpload_controller_1).default; } });
var user_controller_1 = require("./user.controller");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return __importDefault(user_controller_1).default; } });
Object.defineProperty(exports, "UserControllerValidation", { enumerable: true, get: function () { return user_controller_1.UserControllerValidation; } });
