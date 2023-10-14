"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const template = require("../template");
class EmailService {
    emailSend({ emails, subject, message, link, }) {
        const emailCredentials = {
            from: `PMAY <${config_1.email}>`,
            to: emails,
            subject: subject,
            html: link
                ? template.linkEmail(message, link)
                : template.normalMailBody(message),
        };
        return new Promise((resolve, reject) => {
            const transport = nodemailer_1.default.createTransport({
                service: config_1.host,
                auth: {
                    user: config_1.email,
                    pass: config_1.password,
                },
            });
            transport
                .sendMail(emailCredentials)
                .then((info) => {
                return resolve(info);
            })
                .catch((err) => {
                return resolve(err);
            });
        });
    }
}
exports.default = EmailService;
