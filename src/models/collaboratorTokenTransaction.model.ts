import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorTokenTransactionSchema = new Schema(
  {
    collaboratorToken: {
      type: Schema.Types.ObjectId,
      ref: "CollaboratorToken",
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
export const CollaboratorTokenTransaction = mongoose.model(
  "CollaboratorTokenTransaction",
  CollaboratorTokenTransactionSchema,
  "collaborator_token_transaction"
);
