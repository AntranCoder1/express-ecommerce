import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Họ và tên cộng tác viên không được để trống."],
      maxLength: [255, "Họ và tên cộng tác viên quá dài."],
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      maxLength: [255, "Địa chỉ email cộng tác viên quá dài."],
      unique: [true],
    },
    address: {
      type: String,
    },
    avatar: {
      type: Schema.Types.Mixed,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu cộng tác viên kkhông được để trống."],
      minLength: [6, "Mật khẩu cộng tác viên quá ngắn."],
    },
  },
  { timestamps: true }
);
export const Collaborator = mongoose.model(
  "Collaborator",
  CollaboratorSchema,
  "collaborators"
);
