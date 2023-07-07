import mongoose from "mongoose";
const { Schema } = mongoose;
const BankSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên ngân hàng không được để trống."],
      maxLength: [255, "Tên ngân hàng quá dài."],
    },
  },
  { timestamps: true }
);
export const Bank = mongoose.model("Bank", BankSchema, "banks");
