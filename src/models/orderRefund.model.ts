import mongoose from "mongoose";
const { Schema } = mongoose;
const OrderRefundSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Mã Id đơn hàng hoàn tiền không được để trống."],
    },
    amount: {
      type: Number,
      default: 0,
    },
    history: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);
export const OrderRefund = mongoose.model(
  "OrderRefund",
  OrderRefundSchema,
  "order_refunds"
);
