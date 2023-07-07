import mongoose from "mongoose";
const { Schema } = mongoose;
const MarketerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Họ và tên người tiếp thị không được để trống."],
      maxLength: [255, "Họ và tên người tiếp thị quá dài."],
      minLength: [3, "Họ và tên người tiếp thị quá ngắn."],
    },
    email: {
      type: String,
      required: [true, "Địa chỉ email người tiếp thị không được để trống."],
      maxLength: [255, "Địa chỉ email người tiếp thị quá dài."],
      minLength: [3, "Địa chỉ email người tiếp thị quá ngắn."],
    },
    phoneNumber: {
      type: String,
      required: [true, "Số điện thoại người tiếp thị không được để trống."],
      maxLength: [20, "Số điện thoại người tiếp thị quá dài."],
      minLength: [7, "Số điện thoại người tiếp thị quá ngắn."],
    },
    password: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Thông tin doanh nghiệp của người tiếp thị không được để trống.",
      ],
    },
    avatar: {
      type: Schema.Types.Mixed,
    },
    domains: {
      type: Number,
      default: 0,
    },
    referrers: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
  },
  {
    timestamps: true,
  }
);
export const Marketer = mongoose.model("Marketer", MarketerSchema, "marketers");
