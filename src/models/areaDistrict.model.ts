import mongoose from "mongoose";
const { Schema } = mongoose;
export const AreaDistrictSchema = new Schema({
  city: {
    type: Schema.Types.ObjectId,
    ref: "AreaCity",
  },
  name: {
    type: String,
    required: [true, "Tên đơn vị hành chính quận/huyện không được bỏ trống."],
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
  code: {
    type: String,
  },
});
export const AreaDistrict = mongoose.model(
  "AreaDistrict",
  AreaDistrictSchema,
  "area_districts"
);
