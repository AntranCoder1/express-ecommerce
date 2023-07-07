import mongoose from "mongoose";
const { Schema } = mongoose;
const CollaboratorWithdrawHistorySchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    transferMethod: { type: String },
    transactionCode: { type: String, default: "" },
    image: {
      type: Schema.Types.Mixed,
    },
    money: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    description: { type: String },
    token: { type: Number, default: 0 },
    // 0:Yêu cầu rút , 1: Giao dịch đang chờ xử lý, 2: Đã xử lý, 3: Xử lỹ lỗi, 4: Từ chối
  },
  { timestamps: true }
);
export const CollaboratorWithdrawHistory = mongoose.model(
  "CollaboratorWithdrawHistory",
  CollaboratorWithdrawHistorySchema,
  "collaborator_withdraw_histories"
);
