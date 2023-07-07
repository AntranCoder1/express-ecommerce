import mongoose from "mongoose";
const { Schema } = mongoose;
const OrderSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Thông tin doanh nghiệp của đơn hàng không được để trống.",
      ],
    },
    marketer: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
      required: [
        true,
        "Thông tin nhà tiếp thị của đơn hàng không được để trống.",
      ],
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    receiver: {
      type: Schema.Types.Mixed,
    },
    promos: {
      type: Schema.Types.Mixed,
      default: null,
    },
    shipping: {
      type: { type: Schema.Types.ObjectId, ref: "DeliverType" },
      unit: { type: Schema.Types.ObjectId, ref: "Deliver" },
      description: { type: String },
    },
    payment: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: Schema.Types.ObjectId,
      ref: "OrderStatus",
      required: [
        true,
        "Thông tin trạng thái của đơn hàng không được để trống.",
      ],
    },
    refund: {
      type: Schema.Types.ObjectId,
      ref: "OrderRefund",
      default: null,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    isCompanyBuy: {
      type: Number,
      default: 0,
    },
    isPayment: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order", OrderSchema, "orderes");
