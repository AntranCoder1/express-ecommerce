import mongoose from "mongoose";
const { Schema } = mongoose;
const PromoCodeDetailSchema = new Schema({
  discountType: {
    type: String,
    enum: {
      values: ["percent", "fixed"],
    },
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  productType: {
    type: String,
    enum: {
      values: ["all", "group"],
    },
  },
  conditionPrice: [
    {
      maxPrice: { type: Number, default: 0 },
      amountPrice: { type: Number, default: 0 },
    },
  ],
  productList: [{ type: Schema.Types.Mixed }],
});
export const PromoCodeDetail = mongoose.model(
  "PromoCodeDetail",
  PromoCodeDetailSchema,
  "promocode_details"
);
