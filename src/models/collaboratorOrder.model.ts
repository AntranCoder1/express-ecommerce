import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorOrderSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    orderDetail: {
      type: Schema.Types.ObjectId,
      ref: "OrderDetail",
    },
    collaboratorProduct: {
      type: Schema.Types.ObjectId,
      ref: "CollaboratorProduct",
    },
    price: {
      type: Number,
    },
    earn: {
      type: Number,
    },
  },
  { timestamps: true }
);
export const CollaboratorOrder = mongoose.model(
  "CollaboratorOrder",
  CollaboratorOrderSchema,
  "collaboratorOrders"
);
