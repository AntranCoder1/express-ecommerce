import mongoose from "mongoose";
const { Schema } = mongoose;
const ReceiverSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    nickname: {
      type: String,
      maxLength: [255, "Biệt hiệu người nhận quá dài."],
    },
    fullName: {
      type: String,
      required: [true, "Họ và tên người nhận không được để trống."],
      maxLength: [255, "Họ và tên người nhận quá dài."],
    },
    phoneNumber: {
      type: String,
      required: [true, "Số điện thoại người nhận không được để trống."],
      maxLength: [15, "Số điện thoại người nhận quá dài."],
      minLength: [6, "Số điện thoại người nhận quá ngắn."],
    },
    address: {
      type: String,
      required: [true, "Địa chỉ người nhận không được để trống."],
    },
  },
  { timestamps: true }
);
export const Receiver = mongoose.model("Receiver", ReceiverSchema, "receivers");
