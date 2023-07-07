import mongoose from "mongoose";
const { Schema } = mongoose;
const EventProductSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "DomainProduct",
      required: true,
    },
    count: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
export const EventProduct = mongoose.model(
  "EventProduct",
  EventProductSchema,
  "event_product"
);
