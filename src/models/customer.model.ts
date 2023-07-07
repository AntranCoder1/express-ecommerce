import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ và tên người dùng không được để trống."],
      maxLength: [255, "Họ và tên người dùng quá dài."],
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      maxLength: [255, "Địa chỉ email người dùng quá dài."],
      unique: [true],
    },
    address: [
      {
        id: { type: Schema.Types.ObjectId },
        name: { type: String },
        place: { type: String },
        city: { type: Schema.Types.ObjectId, ref: "AreaCity" },
        district: { type: Schema.Types.ObjectId, ref: "AreaDistrict" },
        commune: { type: Schema.Types.ObjectId, ref: "AreaCommune" },
        phoneNumber: { type: String },
        isDefault: { type: Boolean, default: false },
        description: { type: String },
        isHome: { type: Boolean, default: false },
        isCompany: { type: Boolean, default: false },
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
    ],
    avatar: {
      type: Schema.Types.Mixed,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu người dùng kkhông được để trống."],
      minLength: [6, "Mật khẩu người dùng quá ngắn."],
    },
    facebookLoginKey: {
      type: String,
    },
    googleLoginKey: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Customer = mongoose.model("Customer", CustomerSchema, "customers");
