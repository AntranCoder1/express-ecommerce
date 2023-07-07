import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyListFeeTransactionLogSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    CompanyListFee: {
      type: Schema.Types.ObjectId,
      ref: "CompanyListFee",
    },
    type: { type: String },
    lastBalance: { type: Number, default: 0 },
    token: { type: Number, default: 0 },
    transferMethod: { type: String },
    description: { type: String },
    transactionCode: { type: String },
  },
  { timestamps: true }
);
export const ListFeeTransactionLog = mongoose.model(
  "CompanyListFeeTransactionLog",
  CompanyListFeeTransactionLogSchema,
  "company_list_fee_transaction_logs"
);
