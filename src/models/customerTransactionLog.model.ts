import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomerTransactionLogSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    type: { type: String },
    idType: { type: Schema.Types.ObjectId },
    transferMethod: { type: String },
    transactionCode: { type: String, default: "" },
    money: { type: Number, default: 0 },
    description: { type: String },
    token: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const CustomerTransactionLog = mongoose.model(
  "CustomerTransactionLog",
  CustomerTransactionLogSchema,
  "customer_transaction_log"
);
