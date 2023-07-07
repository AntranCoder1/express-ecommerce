import mongoose from "mongoose";
const { Schema } = mongoose;
const CartSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    item: [
      {
        productDomain: { type: Schema.Types.ObjectId, ref: "DomainProduct" },
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        product_version: { type: Schema.Types.ObjectId, ref: "ProductVersion" },
        quantity: { type: Number },
        status: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);
export const Cart = mongoose.model("Cart", CartSchema, "cart");
