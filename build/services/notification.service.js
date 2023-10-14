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
const config_1 = require("../config");
const models_1 = require("../models");
class NotificationLogic {
    pushNotification({ title, body, imageUrl, userIds, users, data, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!users && !userIds)
                    throw new http_errors_1.BadRequest("NotificationFunction users or userIds is required.");
                const usersDetails = users ||
                    (yield models_1.UserSchema.find({ _id: { $in: userIds } }).select("fcmTokens"));
                const args = data
                    ? data
                    : {
                        screen: "Notification",
                    };
                const tokens = usersDetails.map((user) => {
                    if (user === null || user === void 0 ? void 0 : user.fcmToken)
                        return Object.values(user.fcmToken);
                    return [];
                });
                const tempStr = tokens.flat();
                const makeStString = tempStr.filter((item) => item !== undefined);
                if (makeStString === null || makeStString === void 0 ? void 0 : makeStString.length) {
                    yield config_1.Admin.messaging().sendMulticast({
                        tokens: makeStString,
                        notification: {
                            title,
                            body,
                            imageUrl,
                        },
                        data: args,
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = NotificationLogic;
