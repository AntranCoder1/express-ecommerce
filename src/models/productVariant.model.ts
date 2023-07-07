import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductVariantSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [
        true,
        "Thông tin sản phẩm của nhóm phân loại không được để trống.",
      ],
    },
    name: {
      type: String,
      required: [true, "Tên nhóm phân loại không được để trống"],
      maxLength: [255, "Tên nhóm phân loại quá dài."],
    },
    attributes: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);
export const ProductVariant = mongoose.model(
  "ProductVariant",
  ProductVariantSchema,
  "product_variants"
);
