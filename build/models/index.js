"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.ForgetSchema = void 0;
var forget_model_1 = require("./forget.model");
Object.defineProperty(exports, "ForgetSchema", { enumerable: true, get: function () { return __importDefault(forget_model_1).default; } });
var user_model_1 = require("./user.model");
Object.defineProperty(exports, "UserSchema", { enumerable: true, get: function () { return __importDefault(user_model_1).default; } });
