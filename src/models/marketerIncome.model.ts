import mongoose from "mongoose";
const { Schema } = mongoose;
const MarketerIncomeSchema = new Schema(
  {
    marketer: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    totalEarn: { type: Number, default: 0 },
    withdraw: { type: Number, default: 0 },
    expectedEarn: {
      type: Number,
      default: 0,
    },
    commission: {
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
export const MarketerIncome = mongoose.model(
  "MarketerIncome",
  MarketerIncomeSchema,
  "marketerIncomes"
);
