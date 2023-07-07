import mongoose from "mongoose";
const { Schema } = mongoose;
const OrderStatusSchema = new Schema(
  {
    keyword: {
      type: String,
      required: [true, "Từ khóa trạng thái đơn hàng không được để trống."],
      maxLength: [25, "Từ khóa trạng thái đơn hàng quá dài."],
      unique: [true],
    },
    name: {
      type: String,
      required: [true, "Tên trạng thái đơn hàng không được để trống."],
      maxLength: [255, "Tên trạng thái đơn hàng quá dài."],
    },
    modifyOrder: {
      type: Schema.Types.Mixed,
      default: null,
    },
    step: { type: Number },
  },
  { timestamps: true }
);
export const OrderStatus = mongoose.model(
  "OrderStatus",
  OrderStatusSchema,
  "order_statuses"
);
