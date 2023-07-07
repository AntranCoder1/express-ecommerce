import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyProcessingFeechema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    type: { type: String },
    lastBalanceToken: { type: Number, default: 0 },
    token: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);
export const CompanyProcessingFee = mongoose.model(
  "CompanyProcessingFee",
  CompanyProcessingFeechema,
  "company_processing_fee"
);
