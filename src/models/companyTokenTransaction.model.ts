import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyTokenTransactionSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    companyToken: {
      type: Schema.Types.ObjectId,
      ref: "CompanyToken",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    lastBalanceToken: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);
export const CompanyTokenTransaction = mongoose.model(
  "CompanyTokenTransaction",
  CompanyTokenTransactionSchema,
  "company_token_transaction"
);
