import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductVersionSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Thông tin sản phẩm của phiên bản không được để trống."],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Giá thành tối thiểu là 0."],
    },
    attributes: {
      type: String,
      default: "",
      required: [true, "Chuỗi thuộc tính của phiên bản không được để trống."],
    },
    inStock: {
      type: Number,
      default: 0,
      min: [0, "Số lượng sản phẩm trong kho tối thiểu là 0."],
    },
    image: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);
export const ProductVersion = mongoose.model(
  "ProductVersion",
  ProductVersionSchema,
  "product_versions"
);
