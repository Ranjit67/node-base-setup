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
exports.UserControllerValidation = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = require("http-errors");
const helper_1 = require("../helper");
const models_1 = require("../models");
const services_1 = require("../services");
class UserController {
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, helper_1.fieldValidateError)(req);
                const { perPage, pageNo, role, status, gender, searchTitle, userId, } = req.query;
                const arg = {};
                role && (arg["role"] = role);
                status && (arg["status"] = status);
                gender && (arg["gender"] = gender);
                userId && (arg["_id"] = userId);
                if (searchTitle)
                    arg["$or"] = [
                        { name: { $regex: searchTitle, $options: "i" } },
                        { email: { $regex: searchTitle, $options: "i" } },
                        { phoneNumber: { $regex: searchTitle, $options: "i" } },
                        { role: { $regex: searchTitle, $options: "i" } },
                        { gender: { $regex: searchTitle, $options: "i" } },
                    ];
                const dataGate = yield (0, helper_1.getData)(models_1.UserSchema, arg, Number(perPage), Number(pageNo), "", "-password", { createdAt: -1 });
                res.json({
                    success: {
                        data: dataGate,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, helper_1.fieldValidateError)(req);
                const { _id } = req.params;
                const avatarRawData = ((_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.avatar)
                    ? (yield new services_1.MediaStoreService().upload({
                        file: (_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.avatar,
                        dir: "User",
                    }))
                    : undefined;
                const updateUserData = yield models_1.UserSchema.findByIdAndUpdate(_id, Object.assign(Object.assign({}, req.body), { password: undefined, fcmToken: undefined, status: undefined, email: undefined, avatar: avatarRawData === null || avatarRawData === void 0 ? void 0 : avatarRawData.key, avatarPATH: avatarRawData === null || avatarRawData === void 0 ? void 0 : avatarRawData.Location }), {
                    runValidators: true,
                    new: true,
                });
                if (!updateUserData)
                    throw new http_errors_1.NotFound("User is not found.");
                res.json({
                    success: {
                        message: "User is updated successfully.",
                        data: updateUserData,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params;
                const userDelete = yield models_1.UserSchema.findByIdAndDelete(_id);
                if (!userDelete)
                    throw new http_errors_1.NotFound("User not found.");
                res.json({
                    success: {
                        message: "User deleted successfully.",
                        data: userDelete,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserControllerValidation = {
    getAll: [
        (0, express_validator_1.check)("role")
            .optional()
            .exists()
            .custom((value, { req }) => ["SUPER-ADMIN", "ADMIN", "GROUND-STAFF"].some((item) => item === value))
            .withMessage("role must be SUPER-ADMIN , ADMIN or GROUND-STAFF."),
        (0, express_validator_1.query)("gender")
            .optional()
            .exists()
            .custom((value, { req }) => ["MALE", "FEMALE"].some((item) => item === value))
            .withMessage("gender must be MALE or FEMALE."),
        (0, express_validator_1.query)("status")
            .optional()
            .exists()
            .custom((value, { req }) => ["ACTIVE", "BLOCK"].some((item) => item === value))
            .withMessage("status must be ACTIVE or BLOCK."),
        (0, express_validator_1.query)("userId")
            .optional()
            .exists()
            .isMongoId()
            .withMessage("userId must be mongoose id."),
    ],
    updated: [
        (0, express_validator_1.param)("_id")
            .not()
            .isEmpty()
            .withMessage("_id is required.")
            .isMongoId()
            .withMessage("_id must be the mongoose id."),
        (0, express_validator_1.body)("name")
            .optional()
            .isLength({ min: 3 })
            .withMessage("name must be 3 digit.")
            .isLength({ max: 150 })
            .withMessage("name must be 150 digit."),
        (0, express_validator_1.body)("gender")
            .optional()
            .exists()
            .custom((value, { req }) => ["MALE", "FEMALE"].some((item) => item === value))
            .withMessage("gender must be MALE or FEMALE."),
        (0, express_validator_1.body)("deviceName")
            .optional()
            .isLength({ min: 1 })
            .withMessage("deviceName must be at least 1 character.")
            .isLength({ max: 250 })
            .withMessage("deviceName must be at most 50 character."),
        (0, express_validator_1.body)("status")
            .optional()
            .exists()
            .custom((value, { req }) => ["ACTIVE", "BLOCK"].some((item) => item === value))
            .withMessage("status must be ACTIVE or BLOCK."),
        (0, express_validator_1.body)("assignBlockId")
            .optional()
            .isMongoId()
            .withMessage("assignBlockId must be mongoose id."),
    ],
};
exports.default = UserController;
