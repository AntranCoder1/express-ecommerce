import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorTransactionLogSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
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
export const CollaboratorTransactionLog = mongoose.model(
  "CollaboratorTransactionLog",
  CollaboratorTransactionLogSchema,
  "collaborator_transaction_logs"
);
