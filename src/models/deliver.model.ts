import mongoose from "mongoose";
const { Schema } = mongoose;
export const DeliverSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên đơn vị vận chuyển không được để trống."],
      maxLength: [255, "Tên đơn vị vận chuyển quá dài."],
    },
    attributes: {
      type: Schema.Types.Mixed,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const Deliver = mongoose.model("Deliver", DeliverSchema, "delivers");
