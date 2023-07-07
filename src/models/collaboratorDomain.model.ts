import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorDomainSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    domain: [
      {
        type: Schema.Types.ObjectId,
        ref: "Domain",
      },
    ],
  },
  { timestamps: true }
);
export const CollaboratorDomain = mongoose.model(
  "CollaboratorDomain",
  CollaboratorDomainSchema,
  "collaboratorDomains"
);
