import mongoose from "mongoose";
const { Schema } = mongoose;
const PromoCodeSchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: [
        true,
        "Thông tin cửa hàng của mã khuyến mãi không được để trống.",
      ],
    },
    name: {
      type: String,
      required: [true, "Tên mã khuyến mãi không được để trống."],
      minLength: [6, "Tên mã khuyến mãi ít nhất 6 kí tự."],
      maxLength: [24, "Tên mã khuyến mãi tối đa 24 kí tự."],
    },
    limit: {
      type: Number,
      default: 999,
    },
    promoUsed: { type: Number, default: 0 },
    startAt: {
      type: Date,
      default: new Date(),
    },
    endAt: {
      type: Date,
      default: new Date(),
    },
    description: {
      type: String,
    },
    detail: {
      type: Schema.Types.ObjectId,
      ref: "PromoCodeDetail",
    },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);
export const PromoCode = mongoose.model(
  "PromoCode",
  PromoCodeSchema,
  "promocodes"
);
