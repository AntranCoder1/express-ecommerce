import mongoose from "mongoose";
const { Schema } = mongoose;
const DevAnnounceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề thông báo không được để trống."],
    },
    content: {
      type: String,
      required: [true, "Nội dung thông báo không được để trống."],
    },
  },
  { timestamps: true }
);
export const DevAnnounce = mongoose.model(
  "DevAnnounce",
  DevAnnounceSchema,
  "dev_announces"
);
