import { ProductTechnicalSample } from "../models/productTechnicalSample.model";
export const productTechnicalSampleGetListByCompay = async (companyId: any) => {
  const data = await ProductTechnicalSample.find({ company: companyId });
  return data;
};
export const productTechnicalSampleCreate = async (body: any) => {
  const newSample = new ProductTechnicalSample(body);
  await newSample.save();
  return newSample._id;
};
export const productTechnicalSampleUpdate = async (id: any, body: any) => {
  const modified = await ProductTechnicalSample.findByIdAndUpdate(id, body);
  return modified._id;
};
export const productTechnicalSampleDelete = async (id: any) => {
  const result = await ProductTechnicalSample.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Mẫu thông tin đã được xóa.";
  } else {
    return "Không có mẫu thông tin nào bị xóa.";
  }
};
