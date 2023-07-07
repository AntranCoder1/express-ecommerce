import mongoose from "mongoose";
const { Schema } = mongoose;
const TopSearchSchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    domainProductId: { type: Schema.Types.ObjectId, ref: "DomainProduct" },
  },
  { timestamps: true }
);
export const TopSearch = mongoose.model(
  "TopSearch",
  TopSearchSchema,
  "top_search"
);
