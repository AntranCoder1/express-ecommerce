import mongoose from "mongoose";
const { Schema } = mongoose;
export const DeliverTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên loại hình vận chuyển không được để trống."],
      maxlength: [255, "Tên loại hình vận chuyển quá dài."],
    },
    keyword: {
      type: String,
      required: [true, "Từ khóa của loại hình vận chuyển không được để trống."],
      maxLength: [255, "Từ khóa của loại hình vận chuyển quá dài."],
    },
    fee: {
      type: Number,
    },
  },
  { timestamps: true }
);
export const DeliverType = mongoose.model(
  "DeliverType",
  DeliverTypeSchema,
  "deliver_types"
);
