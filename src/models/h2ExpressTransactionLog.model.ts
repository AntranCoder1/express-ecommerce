import mongoose from "mongoose";
const { Schema } = mongoose;
const H2ExpressTransactionLogSchema = new Schema(
  {
    type: { type: String },
    transferMethod: { type: String },
    transactionCode: { type: String, default: "" },
    money: { type: Number, default: 0 },
    description: { type: String },
    token: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const H2ExpressTransactionLog = mongoose.model(
  "H2ExpressTransactionLog",
  H2ExpressTransactionLogSchema,
  "h2_express_transaction_log"
);
