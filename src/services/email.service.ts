import nodemailer from "nodemailer";
import { email, host, password } from "../config";
const template = require("../template");
export default class EmailService {
  public emailSend({
    emails,
    subject,
    message,
    link,
  }: {
    emails: string;
    subject: string;
    message: string;
    link?: string;
  }): any {
    const emailCredentials = {
      from: `PMAY <${email}>`,
      to: emails,
      subject: subject,
      html: link
        ? template.linkEmail(message, link)
        : template.normalMailBody(message),
    };
    return new Promise((resolve, reject) => {
      //   const transport = nodemailer.createTransport({
      //     host: host,
      //     port: 465,
      //     secure: true,
      //     auth: {
      //       user: email,
      //       pass: password,
      //     },
      //   });
      const transport = nodemailer.createTransport({
        service: host,
        auth: {
          user: email,
          pass: password,
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
