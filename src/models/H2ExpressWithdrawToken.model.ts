import mongoose from "mongoose";
const { Schema } = mongoose;
const H2ExpressWithdrawTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    type: { type: String },
    transferMethod: { type: String },
    transactionCode: { type: String, default: "" },
    status: { type: Number, default: 0 },
    description: { type: String },
    token: { type: Number, default: 0 },
    // 0:Yêu cầu rút , 1: Giao dịch đang chờ xử lý, 2: Đã xử lý, 3: Xử lỹ lỗi, 4: Từ chối
  },
  { timestamps: true }
);
export const H2ExpressWithdrawToken = mongoose.model(
  "H2ExpressWithdrawToken",
  H2ExpressWithdrawTokenSchema,
  "h2_express_withdraw_token"
);
