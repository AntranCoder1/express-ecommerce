import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyTransferSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    type: { type: String },
    idType: { type: Schema.Types.ObjectId },
    transferMethod: { type: String },
    lastBalance: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);
export const CompanyTransfer = mongoose.model(
  "CompanyTransfer",
  CompanyTransferSchema,
  "company_transfers"
);
