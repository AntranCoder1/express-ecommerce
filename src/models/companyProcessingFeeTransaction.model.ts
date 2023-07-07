import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyProcessingFeeTransactionchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    companyProcessingFee: {
      type: Schema.Types.ObjectId,
      ref: "CompanyProcessingFee",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    lastBalanceToken: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);
export const CompanyProcessingFeeTransaction = mongoose.model(
  "CompanyProcessingFeeTransaction",
  CompanyProcessingFeeTransactionchema,
  "company_processing_fee_transaction"
);
