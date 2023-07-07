import mongoose from "mongoose";
const { Schema } = mongoose;
export const AreaCommuneSchema = new Schema({
  district: {
    type: Schema.Types.ObjectId,
    ref: "AreaDistrict",
  },
  name: {
    type: String,
    required: [true, "Tên đơn vị hành chính xã/phường không được bỏ trống."],
  },
  type: {
    type: String,
  },
  slug: {
    type: String,
  },
  nameWithType: {
    type: String,
  },
  path: {
    type: String,
  },
  pathWithType: {
    type: String,
  },
});
export const AreaCommune = mongoose.model(
  "AreaCommune",
  AreaCommuneSchema,
  "area_communes"
);
