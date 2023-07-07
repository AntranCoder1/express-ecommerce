import mongoose from "mongoose";
const { Schema } = mongoose;
const FeaturedProductSchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },

    domainProductId: { type: Schema.Types.ObjectId, ref: "DomainProduct" },
  },
  { timestamps: true }
);
export const FeaturedProduct = mongoose.model(
  "FeaturedProduct",
  FeaturedProductSchema,
  "featured_product"
);
