import mongoose from "mongoose";
const { Schema } = mongoose;
const CompanyTokenSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);
export const CompanyToken = mongoose.model(
  "CompanyToken",
  CompanyTokenSchema,
  "company_token"
);
