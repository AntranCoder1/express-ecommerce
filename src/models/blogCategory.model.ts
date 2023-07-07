import mongoose from "mongoose";
const { Schema } = mongoose;
const BlogCategorySchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: [
        true,
        "Thông tin cửa hàng của danh mục bài viết không được để trống.",
      ],
    },
    name: {
      type: String,
      required: [true, "Tên danh mục bài viết không được để trống."],
      maxLength: [50, "Tên danh mục bài viết quá dài."],
    },
    slug: {
      type: String,
      required: [true, "Đường dẫn danh mục không được để trống."],
      maxLength: [255, "Đường dẫn danh mục quá dài."],
    },
    blogs: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export const BlogCategory = mongoose.model(
  "BlogCategory",
  BlogCategorySchema,
  "blog_categories"
);
