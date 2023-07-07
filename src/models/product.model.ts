import mongoose, { SchemaTypes } from "mongoose";
const { Schema } = mongoose;
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm không được để trống."],
      maxLength: [255, "Tên sản phẩm quá dài."],
    },
    importPrice: {
      type: Number,
      required: [true, "Giá nhập sản phẩm không được để trống."],
      default: 0,
      min: [0, "Giá nhập sản phẩm tối thiểu là 0."],
    },
    price: {
      type: Number,
      required: [true, "Giá thành sản phẩm không được để trống."],
      default: 0,
      min: [0, "Giá thành sản phẩm tối thiểu là 0."],
    },
    inStock: {
      type: Number,
      required: [
        true,
        "Số lượng sản phẩm trong kho của sản phẩm không được để trống.",
      ],
      default: 0,
      min: [0, "Số lượng sản phẩm trong kho tối thiểu là 0."],
    },
    isAllowedChangePrice: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "Sản phẩm chưa có mô tả.",
    },
    technicalInfos: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    images: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      default: null,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "ProductSubCategory",
      default: null,
    },
    slug: {
      type: String,
      required: [
        true,
        "Đường dẫn trên thanh địa chỉ của sản phẩm không được để trống.",
      ],
    },
    comments: {
      type: Number,
      default: 0,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Thông tin doanh nghiệp của sản phẩm không được để trống.",
      ],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "AreaCity",
      default: null,
    },
    isDiscount: {
      type: Boolean,
      required: [false],
    },
    discount: {
      type: Number,
      required: [false],
    },
    isListFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Product = mongoose.model("Product", ProductSchema, "products");
