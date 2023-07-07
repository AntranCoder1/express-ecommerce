import mongoose from "mongoose";
const { Schema } = mongoose;
const MaketerDepositSchema = new Schema(
  {
    maketer: {
      type: Schema.Types.ObjectId,
      ref: "Marketer",
    },
    type: { type: String },
    orderTransferId: { type: String },
    transferMethod: { type: String },
    transactionCode: { type: String, default: "" },
    image: {
      type: Schema.Types.Mixed,
    },
    lastBalance: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    status: { type: Number, default: -1 },
    description: { type: String, default: "" },
    token: { type: String, default: 0 },
    // -1:Khởi tạo , 0:	Giao dịch thành công,
    // 1006:	Giao dịch thất bại do người dùng đã từ chối xác nhận thanh toán,
    // 1003:	Giao dịch đã bị hủy,
    // 1005:	Giao dịch thất bại do url hoặc QR code đã hết hạn,
    // 41:	OrderId bị trùng.
    // 42:	OrderId không hợp lệ hoặc không được tìm thấy.
  },
  { timestamps: true }
);
export const MaketerDeposit = mongoose.model(
  "MaketerDeposit",
  MaketerDepositSchema,
  "maketer_deposits"
);
