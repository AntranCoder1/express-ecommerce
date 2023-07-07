import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductSubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục phụ không được để trống."],
      maxLength: [255, "Tên danh mục phụ quá dài."],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Thông tin doanh nghiệp của danh mục phụ không được để trống.",
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: [
        true,
        "Thông tin danh mục chính của danh mục phụ không được để trống.",
      ],
    },
    slug: {
      type: String,
    },
    products: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const ProductSubCategory = mongoose.model(
  "ProductSubCategory",
  ProductSubCategorySchema,
  "product_sub_categories"
);
