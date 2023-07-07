import mongoose from "mongoose";
const { Schema } = mongoose;
export const AreaCitySchema = new Schema({
  name: {
    type: String,
    required: [true, "Tên đơn vị hành chính thành phố không được bỏ trống."],
  },
  slug: {
    type: String,
    required: [true],
  },
  type: {
    type: String,
    required: [true],
  },
  nameWithType: {
    type: String,
    required: [true],
  },
  code: {
    type: String,
    required: [true],
  },
});
export const AreaCity = mongoose.model(
  "AreaCity",
  AreaCitySchema,
  "area_cities"
);
