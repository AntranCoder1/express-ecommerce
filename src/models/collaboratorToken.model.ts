import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorTokenSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);
export const CollaboratorToken = mongoose.model(
  "CollaboratorToken",
  CollaboratorTokenSchema,
  "collaborator_token"
);
