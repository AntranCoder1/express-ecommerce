import mongoose, { SchemaTypes } from "mongoose";
const { Schema } = mongoose;
const ProductConfigTokenchema = new Schema(
  {
    token: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
export const ProductConfigToken = mongoose.model(
  "ProductConfigToken",
  ProductConfigTokenchema,
  "product_config_token"
);
