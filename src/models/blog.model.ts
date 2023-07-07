import mongoose from "mongoose";
const { Schema } = mongoose;
const BlogSchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: [true, "Thông tin cửa hàng của bài viết không được để trống."],
    },
    title: {
      type: String,
      default: "Bài viết không có tiêu đề",
      maxLength: [255, "Tiêu đề bài viết quá dài."],
    },
    slug: {
      type: String,
      required: [true, "Đường dẫn bài viết không được để trống"],
    },
    content: {
      type: Schema.Types.Mixed,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
      required: [true, "Thông tin tác giả của bài viết không được để trống."],
    },
    thumbnail: {
      type: Schema.Types.Mixed,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
    },
  },
  { timestamps: true }
);
export const Blog = mongoose.model("Blog", BlogSchema, "blogs");
