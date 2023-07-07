import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyTransactionLogSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    type: { type: String },
    idType: { type: Schema.Types.ObjectId },
    lastBalance: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    transferMethod: { type: String },
    description: { type: String },
    transactionCode: { type: String },
    token: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const CompanyTransactionLog = mongoose.model(
  "CompanyTransactionLog",
  CompanyTransactionLogSchema,
  "company_transaction_logs"
);
