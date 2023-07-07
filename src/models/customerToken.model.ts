import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomerTokenSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);
export const CustomerToken = mongoose.model(
  "CustomerToken",
  CustomerTokenSchema,
  "customer_token"
);
