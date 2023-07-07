import mongoose from "mongoose";
const { Schema } = mongoose;
const OrderDetailSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    product_domain: { type: Schema.Types.ObjectId, ref: "DomainProduct" },
    product_version: { type: Schema.Types.ObjectId, ref: "ProductVersion" },
    quantity: { type: Number },
    tokenCollaborator: { type: String },
    price: { type: Number },
    importPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const OrderDetail = mongoose.model(
  "OrderDetail",
  OrderDetailSchema,
  "order_details"
);
