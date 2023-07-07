import mongoose from "mongoose";
const { Schema } = mongoose;
const MarketerTokenSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    markerter: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);
export const MarketerToken = mongoose.model(
  "MarketerToken",
  MarketerTokenSchema,
  "marketer_token"
);
