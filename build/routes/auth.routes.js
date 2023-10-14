"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
class AuthRoutes {
    constructor() {
        this.path = "auth";
        this.router = (0, express_1.Router)();
        this.authController = new controllers_1.AuthController();
        this.routes();
    }
    routes() {
        this.router.post("/signup", controllers_1.AuthControllerValidation.register, this.authController.register);
        this.router.post("/signin", controllers_1.AuthControllerValidation.signin, this.authController.signin);
        this.router.post("/change-password", controllers_1.AuthControllerValidation.changePassword, new middleware_1.ProtectedMiddleware().protected, this.authController.changePassword);
        this.router.get("/self", new middleware_1.ProtectedMiddleware().protected, this.authController.self);
        this.router.post("/forget-password-otp-send", controllers_1.AuthControllerValidation.forgetPassword, this.authController.forgetPassword);
        this.router.post("/forget-password-otp-verify", new middleware_1.ProtectedMiddleware().protected, controllers_1.AuthControllerValidation.forgetPasswordOtpVerify, this.authController.forgetPasswordOtpVerify);
    }
}
exports.default = AuthRoutes;
