import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomerIncomeSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
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
export const CustomerIncome = mongoose.model(
  "CustomerIncome",
  CustomerIncomeSchema,
  "customer_incomes"
);
