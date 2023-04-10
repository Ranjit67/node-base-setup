"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const forgetSchema = new mongoose_1.Schema({
    otp: {
        type: Number,
        require: [true, "otp is require."],
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
forgetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 15 });
const ForgetSchema = (0, mongoose_1.model)("Forget", forgetSchema);
ForgetSchema.syncIndexes();
exports.default = ForgetSchema;
