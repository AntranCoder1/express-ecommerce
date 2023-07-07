import mongoose from "mongoose";
const { Schema } = mongoose;
const DomainCategorySchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    name: {
      type: String,
      required: [true, "Tên danh mục sản phẩm không được để trống"],
      maxLength: [100, "Tên danh mục quá dài."],
    },
    slug: {
      type: String,
      required: [true, "Đường dẫn danh mục không được để trống."],
      maxLength: [255, "Đường dẫn danh mục quá dài."],
    },
    icon: {
      type: String,
      required: [true, "Biểu tượng danh mục không được để trống."],
      default: "fas fa-tag",
    },
    products: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const DomainCategory = mongoose.model(
  "DomainCategory",
  DomainCategorySchema,
  "domain_categories"
);
