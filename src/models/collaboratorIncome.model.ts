import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorIncomeSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    totalEarn: { type: Number, default: 0 },
    withdraw: { type: Number, default: 0 },
    expectedEarn: {
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
export const CollaboratorIncome = mongoose.model(
  "CollaboratorIncome",
  CollaboratorIncomeSchema,
  "collaboratorIncomes"
);
