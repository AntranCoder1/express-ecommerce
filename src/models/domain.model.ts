import mongoose from "mongoose";
const { Schema } = mongoose;
const DomainSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên cửa hàng không được để trống."],
      maxLength: [255, "Tên cửa hàng quá dài."],
      minLength: [3, "Tên cửa hàng quá ngắn."],
    },
    address: {
      type: String,
      maxLength: [255, "Địa chỉ cửa hàng quá dài."],
    },
    phoneNumber: {
      type: String,
      required: [true, "Số điện thoại cửa hàng không được để trống."],
      minLength: [7, "Số điện thoại cửa hàng quá ngắn."],
      maxLength: [20, "Số điện thoại cửa hàng quá dài."],
    },
    marketer: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    websiteAddress: {
      type: String,
      required: [true, "Địa chỉ truy cập của cửa hàng không được để trống."],
      minLength: [4, "Địa chỉ truy cập tối thiểu của cửa hàng là 4 kí tự."],
      maxLength: [100, "Địa chỉ truy cập tối đa của cửa hàng là 100 k1i tự."],
    },
    logo: {
      type: Schema.Types.Mixed,
    },
    favicon: {
      type: Schema.Types.Mixed,
    },
    banner: [
      {
        image: { type: String },
        url: { type: String },
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Trạng thái {VALUE} của cửa hàng không hợp lệ.",
      },
      default: "active",
    },
    isChoosen: {
      type: Boolean,
    },
    customStyle: {
      type: Schema.Types.Mixed,
    },
    social: {
      type: Schema.Types.Mixed,
    },
    linkDomain: [
      {
        type: Schema.Types.ObjectId,
        ref: "Domain",
      },
    ],
  },
  { timestamps: true }
);
export const Domain = mongoose.model("Domain", DomainSchema, "domains");
