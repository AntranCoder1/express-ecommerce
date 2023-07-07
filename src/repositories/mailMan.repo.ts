import * as dotenv from "dotenv";
dotenv.config();
import * as nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import fs from "fs";
import path from "path";

const NUSER = process.env.NODEMAILER_USER;
const NPASS = process.env.NODEMAILER_PASS;
const TRANSPORTER = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NUSER,
    pass: NPASS,
  },
});
const ASSETS_FOLDER = path.join(__dirname, "..", "assets");
const HandlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./mail_templates"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./mail_templates"),
  extName: ".handlebars",
};
//#region Customer
export const sendmail_customer_welcome = (body: any) => {
  const mailOptions = {
    from: "quan@h2-devteam.com",
    to: "pthyst2@gmail.com",
    subject:
      "H2Express - Chào mừng quý khách đến với hệ thống thương mại điện tử H2 Express !",
    text: "Đây là thư kiểm thử chức năng. Vui lòng không trả lời.",
  };
  return "Chức năng này chưa có.";
};
export const sendmail_customer_forgotPassword = () => {
  return "Chức năng này chưa có.";
};
export const sendmail_customer_createOrder = () => {
  return "Chức năng này chưa có.";
};
export const sendmail_customer_deliveringOrder = () => {
  return "Chức năng này chưa có.";
};
export const sendmail_customer_rateProduct = () => {
  return "Chức năng này chưa có.";
};
export const sendmail_customer_promocode = () => {
  return "Chức năng này chưa có.";
};
//#endregion
//#region Company
export const sendmail_company_welcome = () => {
  return "Chức năng này chưa có.";
};
export const sendmail_company_forgotPassword = () => {
  return "Chức năng này chưa có.";
};
//#endregion
//#region Marketer
export const sendmail_marketer_welcome = () => {
  return "Chức năng này chưa có.";
};
export const sendmail_marketer_forgotPassword = () => {
  return "Chức năng này chưa có.";
};
//#endregion

export const sendmail_test = async () => {
  const options: any = HandlebarOptions;
  TRANSPORTER.use("compile", hbs(options));
  const mailOptions = {
    from: "quan@h2-devteam.com",
    to: "pthyst2@gmail.com",
    subject: "Kiểm thử chức năng gửi thư",
    template: "test",
    attachments: [
      {
        filename: "h2express.png",
        path: ASSETS_FOLDER + "/images/h2express.png",
        cid: "h2logo",
      },
    ],
  };
  TRANSPORTER.sendMail(mailOptions, (err) => {
    if (err) {
      throw new Error("Có lỗi xảy ra khi gửi thư");
    }
  });
};
