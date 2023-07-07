import mongoose, { SchemaTypes } from "mongoose";
const { Schema } = mongoose;
const CompanyLisFeeSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Thông tin doanh nghiệp của sản phẩm không được để trống.",
      ],
    },
    type: {
      type: String,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    transferMethod: { type: String },
    lastBalance: { type: Number, default: 0 },
    token: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
export const ListFee = mongoose.model(
  "CompanyListFee",
  CompanyLisFeeSchema,
  "company_list_fee"
);
