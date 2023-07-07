import mongoose from "mongoose";
const { Schema } = mongoose;
const OrderCancelSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Mã Id đơn hàng hủy không được để trống."],
    },
    reasonCancel: {
      type: String,
      required: [true, "Lý do hủy không được để trống"],
    },
    roleCancel: {
      type: String,
      required: [true, "Vai trò người hủy không được để trống"],
    },
    idPersonCancel: {
      type: Schema.Types.ObjectId,
      required: [true, "Mã vai trò người hủy không được để trống"],
    },
  },
  { timestamps: true }
);
export const OrderCancel = mongoose.model(
  "OrderCancel",
  OrderCancelSchema,
  "order_cancels"
);
