import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyIncomeSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    totalEarn: { type: Number, default: 0 },
    transfer: { type: Number, default: 0 },
    expectedEarn: {
      type: Number,
      default: 0,
    },
    refunds: {
      type: Number,
      default: 0,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    deposit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const CompanyIncome = mongoose.model(
  "CompanyIncome",
  CompanyIncomeSchema,
  "company_incomes"
);
