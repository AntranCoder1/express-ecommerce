import mongoose from "mongoose";
const { Schema } = mongoose;
const MarketerTransactionLogSchema = new Schema(
  {
    marketer: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
    type: { type: String },
    idType: { type: Schema.Types.ObjectId },
    money: { type: Number, default: 0 },
    transferMethod: { type: String },
    description: { type: String },
    transactionCode: { type: String },
    token: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const MarketerTransactionLog = mongoose.model(
  "MarketerTransactionLog",
  MarketerTransactionLogSchema,
  "marketer_transaction_logs"
);
