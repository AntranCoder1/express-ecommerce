import mongoose from "mongoose";
const { Schema } = mongoose;
const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm không được để trống."],
    },
    slug: {
      type: String,
      required: [true],
    },
    typeBrand: {
      type: String,
    },
    categories: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: [true],
    },
    imgBrand: { type: String },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [
        true,
        "Thông tin doanh nghiệp của sản phẩm không được để trống.",
      ],
    },
  },
  { timestamps: true }
);
export const Brand = mongoose.model("Brand", BrandSchema, "brand");
