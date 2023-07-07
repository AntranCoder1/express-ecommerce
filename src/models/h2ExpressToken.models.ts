import mongoose from "mongoose";
const { Schema } = mongoose;
const H2ExpressTokenSchema = new Schema(
  {
    token: { type: Number, default: 0 },
    description: { type: String },
    isAdmin: { type: Number, default: 1 },
  },
  { timestamps: true }
);
export const H2ExpressToken = mongoose.model(
  "H2ExpressToken",
  H2ExpressTokenSchema,
  "h2_express_token"
);
