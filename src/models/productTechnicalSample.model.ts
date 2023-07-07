import mongoose from "mongoose";
const { Schema } = mongoose;
const ProductTechnicalSampleSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
    },
    name: {
      type: String,
      required: [true, "Tên của mẫu thông tin không được để trống."],
      maxlength: [255, "Tên của mẫu thông tin quá dài."],
    },
    technicals: [
      {
        type: Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: true }
);
export const ProductTechnicalSample = mongoose.model(
  "ProductTechnicalSample",
  ProductTechnicalSampleSchema,
  "product_technical_samples"
);
