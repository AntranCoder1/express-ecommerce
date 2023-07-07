import mongoose from "mongoose";
const { Schema } = mongoose;
const EventSchema = new Schema(
  {
    domain: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: Schema.Types.Mixed,
    },
    images: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    start_time: {
      type: Number,
    },
    finish_time: {
      type: Number,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);
export const Event = mongoose.model("Event", EventSchema, "events");
