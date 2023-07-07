import mongoose from "mongoose";
const { Schema } = mongoose;

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên doanh nghiệp không được để trống."],
      maxLength: [255, "Tên doanh nghiệp quá dài."],
    },
    email: {
      type: String,
      required: [true, "Địa chỉ email doanh nghiệp không được để trống."],
      maxLength: [255, "Địa chỉ email doanh nghiệp quá dài."],
      minLenth: [3, "Địa chỉ email doanh nghiệp quá ngắn."],
    },
    phoneNumber: {
      type: String,
      required: [true, "Số điện thoại doanh nghiệp không được để trống."],
      maxLength: [20, "Số điện thoại doanh nghiệp quá dài."],
      minLength: [7, "Số điện thoại doanh nghiệp quá ngắn."],
    },
    password: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Địa chỉ trụ sở doanh nghiệp không được để trống."],
      maxLength: [255, "Địa chỉ trụ sở doanh nghiệp quá dài."],
    },
    marketers: {
      type: Number,
      default: 0,
    },
    logo: {
      type: Schema.Types.Mixed,
    },
    favicon: {
      type: Schema.Types.Mixed,
    },
    delivers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Deliver",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Company = mongoose.model("Company", CompanySchema, "companies");
