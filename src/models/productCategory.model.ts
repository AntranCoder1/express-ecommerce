import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductCategorySchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Doanh nghiệp quản lý danh mục sản phẩm không được để trống.",
      ],
    },
    icon: {
      type: String,
      required: [true, "Biểu tượng thu nhỏ của danh mục không được để trống."],
      default: "fas fa-tag",
    },
    name: {
      type: String,
      required: [true, "Tên danh mục sản phẩm không được để trống."],
      maxLength: [255, "Tên danh mục sản phẩm quá dài."],
    },
    slug: {
      type: String,
    },
    products: {
      type: Number,
      default: 0,
      min: [0, "Số lượng sản phẩm tối thiểu của danh mục là 0."],
    },
  },
  { timestamps: true }
);
export const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema,
  "product_categories"
);
