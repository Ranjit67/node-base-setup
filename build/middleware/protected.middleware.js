"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
const models_1 = require("../models");
const services_1 = require("../services");
class ProtectedMiddleware extends services_1.JwtService {
    protected(req, res, next) {
        const _super = Object.create(null, {
            accessTokenVerify: { get: () => super.accessTokenVerify }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.headers["authorization"])
                    throw new http_errors_1.Unauthorized("Unauthorized");
                const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a["authorization"].split(" ")[1];
                if (!token)
                    throw new http_errors_1.Unauthorized("Unauthorized");
                const payload = _super.accessTokenVerify.call(this, token);
                if (!(payload === null || payload === void 0 ? void 0 : payload.aud))
                    throw new http_errors_1.Unauthorized("Unauthorized");
                let objectCreate = JSON.parse(payload.aud);
                if (!objectCreate.userId)
                    throw new http_errors_1.Unauthorized("Unauthorized");
                const findUserStatus = yield models_1.UserSchema.findById(objectCreate.userId).select("status");
                if (!findUserStatus)
                    throw new http_errors_1.Unauthorized("Unauthorized");
                if ((findUserStatus === null || findUserStatus === void 0 ? void 0 : findUserStatus.status) !== "ACTIVE")
                    throw new http_errors_1.Locked("You are block by your higher authority.");
                req.payload = objectCreate;
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ProtectedMiddleware;
