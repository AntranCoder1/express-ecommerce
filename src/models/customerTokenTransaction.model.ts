import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomerTokenTransactionSchema = new Schema(
  {
    customerToken: {
      type: Schema.Types.ObjectId,
      ref: "CustomerToken",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    lastBalanceToken: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);
export const CustomerTokenTransaction = mongoose.model(
  "CustomerTokenTransaction",
  CustomerTokenTransactionSchema,
  "customer_token_transaction"
);
