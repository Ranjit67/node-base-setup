"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
class UserRoutes {
    constructor() {
        this.path = "user";
        this.router = (0, express_1.Router)();
        this.userController = new controllers_1.UserController();
        this.routes();
    }
    routes() {
        this.router.get("/", controllers_1.UserControllerValidation.getAll, new middleware_1.ProtectedMiddleware().protected, this.userController.getAll);
        this.router.put("/update/:_id", controllers_1.UserControllerValidation.updated, new middleware_1.ProtectedMiddleware().protected, this.userController.update);
        this.router.delete("/delete/:_id", controllers_1.UserControllerValidation.updated, new middleware_1.ProtectedMiddleware().protected, this.userController.update);
    }
}
exports.default = UserRoutes;
