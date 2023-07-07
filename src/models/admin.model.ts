import mongoose from "mongoose";
const { Schema } = mongoose;
const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Họ và tên admin không được để trống."],
      maxLength: [255, "Họ và tên admin quá dài."],
    },
    email: {
      type: String,
      maxLength: [255, "Địa chỉ email admin quá dài."],
      unique: [true],
    },
    avatar: {
      type: Schema.Types.Mixed,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu admin kkhông được để trống."],
      minLength: [6, "Mật khẩu admin quá ngắn."],
    },
  },
  { timestamps: true }
);
export const Admin = mongoose.model("Admin", AdminSchema, "admins");
