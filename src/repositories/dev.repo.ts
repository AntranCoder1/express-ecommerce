import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
export const createRandomSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};
// export const testSendMail = async () => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.NODEMAILER_USER?.toString(),
//       pass: process.env.NODEMAILER_PASS?.toString(),
//     },
//   });
//   const mailOptions = {
//     from: "h2express@devteam.com",
//     to: "pthyst2@gmail.com",
//     subject:
//       "Cơ hội nhận ngay khuyến mãi sốc. Giảm 30% đối với iPhone 14 PRO MAX VIP SIÊU CẤP Thiền Am bên bờ Vũ Trụ",
//     text: "Đây là thư dùng để kiểm thử chức năng gửi thư. Vui lòng không trả lời thư.",
//   };
//   return transporter.sendMail(mailOptions, () => {});
// };
