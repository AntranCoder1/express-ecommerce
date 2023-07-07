import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductVariantSampleSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    name: {
      type: String,
      required: [true, "Tên nhóm phân loại không được để trống."],
      maxLength: [255, "Tên nhóm phân loại quá dài."],
    },
    attributes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
export const ProductVariantSample = mongoose.model(
  "ProductVariantSample",
  ProductVariantSampleSchema,
  "product_variant_samples"
);
