import mongoose from "mongoose";
const { Schema } = mongoose;
const H2ExpressTokenTransactionSchema = new Schema(
  {
    h2ExpressToken: {
      type: Schema.Types.ObjectId,
      ref: "H2ExpressToken",
    },
    type: { type: String },
    token: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);
export const H2ExpressTokenTransaction = mongoose.model(
  "H2ExpressTokenTransaction",
  H2ExpressTokenTransactionSchema,
  "h2_express_token_transaction"
);
