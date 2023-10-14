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
const mongoose_1 = require("mongoose");
const services_1 = require("../services");
const userSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: {
            values: ["SUPER-ADMIN", "ADMIN"],
            message: `Role should be one of SUPER-ADMIN, ADMIN, GROUND-STAFF`,
        },
        required: [true, "role is required"],
    },
    password: {
        type: String,
        minlength: [4, "Password should be atleast 4 characters long"],
        maxlength: [100, "Password should be atmost 100 characters long"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
        unique: true,
        type: String,
        index: true,
    },
    photoUrl: {
        type: String,
    },
    photoRef: {
        type: String,
    },
    phoneNumber: {
        type: String,
        minlength: [8, "Phone number must be at least 8 characters long"],
        maxlength: [15, "Phone number must be at most 15 characters long"],
    },
    gender: {
        type: String,
        enum: {
            values: ["MALE", "FEMALE"],
            message: "Gender value should be one of MALE, FEMALE.",
        },
    },
    slagName: {
        type: String,
    },
    deviceName: {
        type: String,
    },
    lastLogInTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "INACTIVE"],
            message: "Status value should be one of ACTIVE, INACTIVE.",
        },
        default: "ACTIVE",
    },
    fcmToken: {
        android: {
            type: String,
        },
        ios: {
            type: String,
        },
        web: {
            type: String,
        },
    },
}, { timestamps: true }).pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = this.password
            ? yield new services_1.PasswordHasServices().hash(this.password)
            : undefined;
        next();
    });
});
const UserSchema = (0, mongoose_1.model)("User", userSchema);
UserSchema.syncIndexes();
exports.default = UserSchema;
