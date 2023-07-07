import mongoose from "mongoose";
const { Schema } = mongoose;
const CreditCardSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "Loại thẻ không được để trống."],
      enum: {
        values: ["visa", "napas", "mastercard"],
        message: "Loại thẻ {VALUE} không hợp lệ.",
      },
    },
    holder: {
      type: String,
      required: [true, "Tên chủ thẻ tín dụng không được để trống."],
      maxLength: [30, "Tên chủ thẻ tín dụng quá dài."],
    },
    expMonth: {
      type: Number,
      required: [true, "Tháng hết hạn của thẻ không được để trống."],
      max: [12, "Tháng hết hạn của thẻ không hợp lệ."],
      min: [1, "Tháng hết hạn của thẻ không hợp lệ."],
    },
    expYear: {
      type: Number,
      required: [true, "Năm hết hạn của thẻ không được để trống."],
      min: [21, "Năm hết hạn của thẻ không hợp lệ."],
    },
    securityNumber: {
      type: String,
      required: [true, "Mã số bảo mật của thẻ không được để trống."],
      validate: [/\w{3}/, "Mã số bảo mật của thẻ không hợp lệ"],
    },
    number: {
      type: String,
      required: [true, "Mã số thẻ không được để trống."],
      validate: [/\w{15,19}/, "Mã số thẻ tín dụng không hợp lệ."],
    },
    lastFour: {
      type: String,
    },
    userType: {
      type: String,
      required: [true, "Loại người dùng thẻ không được để trống."],
      enum: {
        values: ["company", "marketer"],
        message: "Loại người dùng thẻ {VALUE} không hợp lệ.",
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Id người dùng thẻ không được để trống."],
    },
  },
  { timestamps: true }
);
export const CreditCard = mongoose.model(
  "CreditCard",
  CreditCardSchema,
  "creditcards"
);
