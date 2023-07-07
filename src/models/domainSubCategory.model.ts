import mongoose from "mongoose";
const { Schema } = mongoose;
const DomainSubCategorySchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    name: {
      type: String,
      required: [true, "Tên danh mục phụ không được để trống."],
      maxLength: [100, "Tên danh mục phụ quá dài."],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "DomainCategory",
    },
    slug: {
      type: String,
      required: [true, "Đường dẫn danh mục phụ không được để trống."],
      maxLength: [255, "Đường dẫn danh mục phụ quá dài."],
    },
    products: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const DomainSubCategory = mongoose.model(
  "DomainSubCategory",
  DomainSubCategorySchema,
  "domain_sub_categories"
);
