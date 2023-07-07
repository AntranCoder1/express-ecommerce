import mongoose from "mongoose";
const { Schema } = mongoose;
const MomoBusinessSchema = new Schema({
  userType: {
    type: String,
    required: [true, "Loại người dùng tích hợp không được để trống."],
    enum: {
      values: ["company", "marketer"],
      message: "Loại người dùng tích hợp {VALUE} không hợp lệ.",
    },
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "Id người dùng tích hợp không được để trống."],
  },
  partnerCode: {
    type: String,
    required: [true, "Mã đối tác không được để trống."],
    validate: [/[0-9a-zA-Z]{16}/, "Mã đối tác không hợp lệ."],
  },
  accessKey: {
    type: String,
    required: [true, "Khóa truy cập không được bỏ trống."],
  },
  secretKey: {
    type: String,
    required: [true, "Khóa bí mật không được để trống."],
  },
  apiEndPoint: {
    type: String,
    required: [true, "Điểm cuối API giao dịch qua MOMO không được để trống."],
  },
});
export const MomoBusiness = mongoose.model(
  "MomoBusiness",
  MomoBusinessSchema,
  "momo_business"
);
