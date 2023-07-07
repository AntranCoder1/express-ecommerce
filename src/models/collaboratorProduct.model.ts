import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorProductSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    domainProduct: {
      type: Schema.Types.ObjectId,
      ref: "DomainProduct",
    },
    token: { type: String, unique: true },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);
export const CollaboratorProduct = mongoose.model(
  "CollaboratorProduct",
  CollaboratorProductSchema,
  "collaboratorProducts"
);
