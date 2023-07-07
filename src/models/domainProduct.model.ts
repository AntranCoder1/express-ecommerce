import mongoose from "mongoose";
const { Schema } = mongoose;
const DomainProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    domain_price: {
      type: Number,
      default: 0,
      min: [0, "Giá tiền tối thiểu của sản phẩm là 0."],
    },
    domain_category: {
      type: Schema.Types.ObjectId,
      ref: "DomainCategory",
      default: null,
    },
    domain_subCategory: {
      type: Schema.Types.ObjectId,
      ref: "DomainSubCategory",
      default: null,
    },
    domain_productVersion: [
      {
        product_version_id: {
          type: Schema.Types.ObjectId,
          ref: "ProductVersion",
        },
        domain_product_price: { type: Number, default: 0 },
      },
    ],
    isCommission: {
      type: Boolean,
      default: false,
    },
    commissionPercent: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export const DomainProduct = mongoose.model(
  "DomainProduct",
  DomainProductSchema,
  "domain_products"
);
