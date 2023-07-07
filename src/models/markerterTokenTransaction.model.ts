import mongoose from "mongoose";
const { Schema } = mongoose;
const MarketerTokenTransactionSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    markerterToken: {
      type: Schema.Types.ObjectId,
      ref: "MarketerToken",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    lastBalanceToken: { type: Number, default: 0 },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
export const MarketerTokenTransaction = mongoose.model(
  "MarketerTokenTransaction",
  MarketerTokenTransactionSchema,
  "marketer_token_transaction"
);
