import mongoose, { SchemaType } from "mongoose";
const { Schema } = mongoose;
const ReviewSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    domainProductId: {
      type: Schema.Types.ObjectId,
      ref: "DomainProduct",
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    maketerId: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
    star: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
      default: "",
    },
    titleComment: {
      type: String,
      default: "",
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const Review = mongoose.model("Review", ReviewSchema, "reviews");
