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
exports.AuthControllerValidation = void 0;
const express_validator_1 = require("express-validator");
const http_errors_1 = require("http-errors");
const helper_1 = require("../helper");
const models_1 = require("../models");
const services_1 = require("../services");
class AuthController {
    register(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, password, name, email, phoneNumber, gender, deviceName, status, } = req.body;
                (0, helper_1.fieldValidateError)(req);
                const avatarRawData = ((_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.photo)
                    ? (yield new services_1.MediaStoreService().upload({
                        file: (_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.photo,
                        dir: "User",
                    }))
                    : undefined;
                const checkDuplicate = yield models_1.UserSchema.findOne({ email });
                if (checkDuplicate)
                    throw new http_errors_1.Conflict("This email is already exit.");
                const userRegister = yield models_1.UserSchema.create({
                    role,
                    password,
                    name,
                    email,
                    phoneNumber,
                    deviceName,
                    gender,
                    status,
                    photoUrl: avatarRawData === null || avatarRawData === void 0 ? void 0 : avatarRawData.key,
                    photoRef: avatarRawData === null || avatarRawData === void 0 ? void 0 : avatarRawData.Location,
                });
                if (!userRegister)
                    throw new http_errors_1.InternalServerError("Something went wrong., user not created.");
                yield new services_1.EmailService().emailSend({
                    emails: email,
                    subject: "New user add",
                    message: `Hi ${name}
        your username: ${email}
        and password: ${password}`,
                });
                res.json({
                    success: {
                        message: "User register successfully.",
                        data: userRegister,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role } = req.query;
                const { email, password } = req.body;
                (0, helper_1.fieldValidateError)(req);
                let user = yield models_1.UserSchema.findOne({
                    email,
                });
                if (!user)
                    throw new http_errors_1.NotFound("Username and password are incorrect.");
                if ((user === null || user === void 0 ? void 0 : user.role) !== role)
                    throw new http_errors_1.NotFound("You are not permitted to login here.");
                const isPasswordMatch = user.password
                    ? yield new services_1.PasswordHasServices().compare(password, user.password)
                    : undefined;
                if (!isPasswordMatch)
                    throw new http_errors_1.NotFound("Password is incorrect.");
                const token = yield new services_1.JwtService().accessTokenGenerator(JSON.stringify({
                    userId: user._id,
                    role: user.role,
                    status: user.status,
                }));
                if (!token)
                    throw new http_errors_1.Unauthorized("Token generate failed.");
                user.password = undefined;
                res.json({
                    success: {
                        data: {
                            token,
                            user,
                        },
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    self(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = req === null || req === void 0 ? void 0 : req.payload) === null || _a === void 0 ? void 0 : _a.userId;
            const findUserData = yield models_1.UserSchema.findOne({ _id: userId }).select("-password -__v ");
            res.json({
                success: {
                    data: findUserData,
                },
            });
        });
    }
    changePassword(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                const role = (_a = req === null || req === void 0 ? void 0 : req.payload) === null || _a === void 0 ? void 0 : _a.role;
                const user_id = userId && role == "SUPER-ADMIN" ? userId : (_b = req === null || req === void 0 ? void 0 : req.payload) === null || _b === void 0 ? void 0 : _b.userId;
                const { oldPassword, newPassword } = req.body;
                (0, helper_1.fieldValidateError)(req);
                let user = yield models_1.UserSchema.findById(user_id);
                if (!user)
                    throw new http_errors_1.NotFound("Username and password are incorrect.");
                if (!userId && role == "SUPER-ADMIN") {
                    const isPasswordMatch = user.password
                        ? yield new services_1.PasswordHasServices().compare(oldPassword, user.password)
                        : undefined;
                    if (!isPasswordMatch)
                        throw new http_errors_1.NotFound("Password is incorrect.");
                }
                else if (role !== "SUPER-ADMIN") {
                    const isPasswordMatch = user.password
                        ? yield new services_1.PasswordHasServices().compare(oldPassword, user.password)
                        : undefined;
                    if (!isPasswordMatch)
                        throw new http_errors_1.NotFound("Password is incorrect.");
                }
                const hashPassword = yield new services_1.PasswordHasServices().hash(newPassword);
                const updateUser = yield models_1.UserSchema.findByIdAndUpdate(user_id, {
                    password: hashPassword,
                }, {
                    runValidators: true,
                    new: true,
                });
                if (!updateUser)
                    throw new http_errors_1.NotFound("Something went wrong, Password not updated.");
                res.json({
                    success: {
                        message: "Password change successfully.",
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                (0, helper_1.fieldValidateError)(req);
                const findUser = yield models_1.UserSchema.findOne({ email });
                if (!findUser)
                    throw new http_errors_1.NotFound("User not Found.");
                const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                const createAndUpdate = yield models_1.ForgetSchema.findOneAndUpdate({ user: findUser === null || findUser === void 0 ? void 0 : findUser._id }, {
                    otp,
                }, { runValidators: true, upsert: true });
                yield new services_1.EmailService().emailSend({
                    emails: email,
                    subject: "Forget password",
                    message: `Hi ${findUser === null || findUser === void 0 ? void 0 : findUser.name}
          Important!! Don't share your otp
          your otp is ${otp}. OTP valid for 15 minutes.`,
                });
                const token = yield new services_1.JwtService().accessTokenGenerator(JSON.stringify({
                    userId: findUser._id,
                    role: findUser.role,
                    status: findUser.status,
                    otp: true,
                }));
                if (!token)
                    throw new http_errors_1.Unauthorized("Token generate failed.");
                res.json({
                    success: {
                        message: "OTP is send to your email, Please check your email.",
                        data: {
                            token,
                        },
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgetPasswordOtpVerify(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, password } = req.body;
                (0, helper_1.fieldValidateError)(req);
                const user = (_a = req === null || req === void 0 ? void 0 : req.payload) === null || _a === void 0 ? void 0 : _a.userId;
                const findForgetPassword = yield models_1.ForgetSchema.findOne({ user });
                if (!(findForgetPassword === null || findForgetPassword === void 0 ? void 0 : findForgetPassword.otp))
                    throw new http_errors_1.NotFound("Your otp has expired.");
                if ((findForgetPassword === null || findForgetPassword === void 0 ? void 0 : findForgetPassword.otp) !== parseInt(otp))
                    throw new http_errors_1.Conflict("Yor otp is not match.");
                const hashPassword = yield new services_1.PasswordHasServices().hash(password);
                const updateUser = yield models_1.UserSchema.findByIdAndUpdate(user, {
                    password: hashPassword,
                }, {
                    runValidators: true,
                    new: true,
                });
                if (!updateUser)
                    throw new http_errors_1.NotFound("Something went wrong, Password not set.");
                const deleteForget = yield models_1.ForgetSchema.findOneAndDelete({ user });
                res.json({
                    success: {
                        message: "Password set successfully.",
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthControllerValidation = {
    register: [
        (0, express_validator_1.body)("name")
            .not()
            .isEmpty()
            .withMessage("name is required.")
            .isLength({ min: 3 })
            .withMessage("name must be at least 3 characters long.")
            .isLength({ max: 50 })
            .withMessage("name must be at most 50 characters long."),
        (0, express_validator_1.body)("password")
            .not()
            .isEmpty()
            .withMessage("password is required.")
            .isLength({ min: 3 })
            .withMessage("password must be at least 3 characters long.")
            .isLength({ max: 50 })
            .withMessage("password must be at most 50 characters long."),
        (0, express_validator_1.body)("email")
            .not()
            .isEmpty()
            .withMessage("email is required.")
            .isEmail()
            .withMessage("Invalid mail id")
            .normalizeEmail()
            .isLength({ min: 3 })
            .withMessage("email must be at least 3 characters long.")
            .isLength({ max: 50 })
            .withMessage("email must be at most 50 characters long."),
        (0, express_validator_1.body)("phoneNumber").not().isEmpty().withMessage("phoneNumber is required."),
        (0, express_validator_1.body)("gender")
            .optional()
            .exists()
            .toUpperCase()
            .isIn(["MALE", "FEMALE"])
            .withMessage("gender must be MALE or FEMALE."),
        (0, express_validator_1.body)("role")
            .not()
            .isEmpty()
            .withMessage("role is required.")
            .exists()
            .toUpperCase()
            .isIn(["SUPER-ADMIN", "ADMIN"])
            .withMessage("role must be SUPER-ADMIN or ADMIN."),
        (0, express_validator_1.body)("deviceName")
            .optional()
            .isLength({ min: 1 })
            .withMessage("deviceName must be at least 1 character.")
            .isLength({ max: 250 })
            .withMessage("deviceName must be at most 50 character."),
        (0, express_validator_1.body)("status")
            .optional()
            .exists()
            .isIn(["ACTIVE", "BLOCK"])
            .withMessage("status must be ACTIVE or BLOCK."),
    ],
    signin: [
        (0, express_validator_1.body)("password").not().isEmpty().withMessage("password is required."),
        (0, express_validator_1.body)("email")
            .not()
            .isEmpty()
            .withMessage("email is required.")
            .isEmail()
            .withMessage("email is not valid."),
        (0, express_validator_1.query)("role")
            .not()
            .isEmpty()
            .withMessage("role is required.")
            .exists()
            .toUpperCase()
            .isIn(["SUPER-ADMIN", "ADMIN"])
            .withMessage("role must be SUPER-ADMIN or ADMIN."),
    ],
    changePassword: [
        (0, express_validator_1.body)("oldPassword")
            .if((value, { req }) => {
            var _a;
            return Boolean(((_a = req === null || req === void 0 ? void 0 : req.payload) === null || _a === void 0 ? void 0 : _a.role) !== "SUPER-ADMIN");
        })
            .not()
            .isEmpty()
            .withMessage("oldPassword is required.")
            .if((value, { req }) => {
            var _a;
            return Boolean(((_a = req === null || req === void 0 ? void 0 : req.payload) === null || _a === void 0 ? void 0 : _a.role) !== "SUPER-ADMIN");
        })
            .optional(),
        (0, express_validator_1.body)("newPassword")
            .not()
            .isEmpty()
            .withMessage("newPassword is required.")
            .isLength({ min: 3 })
            .withMessage("newPassword must be at least 3 characters long.")
            .isLength({ max: 50 })
            .withMessage("newPassword must be at most 50 characters long."),
    ],
    forgetPassword: [
        (0, express_validator_1.body)("email")
            .not()
            .isEmpty()
            .withMessage("email is required.")
            .isEmail()
            .withMessage("email is not valid."),
    ],
    forgetPasswordOtpVerify: [
        (0, express_validator_1.body)("otp")
            .not()
            .isEmpty()
            .withMessage("otp is required.")
            .isNumeric()
            .withMessage("otp must be number."),
        (0, express_validator_1.body)("password")
            .not()
            .isEmpty()
            .withMessage("password is required.")
            .isLength({ min: 3 })
            .withMessage("password must be at least 3 characters long.")
            .isLength({ max: 50 })
            .withMessage("password must be at most 50 characters long."),
    ],
};
exports.default = AuthController;
