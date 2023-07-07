import mongoose from "mongoose";
const { Schema } = mongoose;
const BankBranchSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên chi nhánh ngân hàng không được để trống."],
      maxLength: [255, "Tên chi nhánh ngân hàng quá dài."],
    },
    bank: {
      type: Schema.Types.ObjectId,
      ref: "Bank",
      required: [
        true,
        "Thông tin ngân hàng của chi nhánh không được để trống.",
      ],
    },
  },
  { timestamps: true }
);
export const BankBranch = mongoose.model(
  "BankBranch",
  BankBranchSchema,
  "bank_branchs"
);
