import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductLinkDomainSchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    linkDomain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    linkDomainProductId: { type: Schema.Types.ObjectId, ref: "DomainProduct" },
  },
  { timestamps: true }
);
export const ProductLinkDomain = mongoose.model(
  "ProductLinkDomain",
  ProductLinkDomainSchema,
  "product_link_domain"
);
