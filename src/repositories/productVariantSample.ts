import { ProductVariantSample } from "./../models/productVariantSample";
import { productVariantSamples } from "../seeds/productVariantSamples.seed";
export const productVariantSampleGetListByCompany = async (companyId: any) => {
  const result = await ProductVariantSample.find({ company: companyId });
  return result;
};
export const productVariantSampleCreate = async (body: any) => {
  const newSample = new ProductVariantSample(body);
  await newSample.save();
  return newSample._id;
};
export const productVariantSampleUpdate = async (id: any, body: any) => {
  const modified = await ProductVariantSample.findByIdAndUpdate(id, body);
  return modified._id;
};
export const productVariantSampleDelete = async (id: any) => {
  const result = await ProductVariantSample.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Mẫu nhóm phân loại đã bị xóa.";
  } else {
    return "Không có mẫu nhóm phân loại nào bị xóa.";
  }
};
export const productVariantSampleSeedForCompany = async (companyId: any) => {
  for (const sample of productVariantSamples) {
    const newSample = new ProductVariantSample({
      name: sample.name,
      attributes: sample.attributes,
      company: companyId,
    });
    await newSample.save();
  }
};
export const productVariantSampleDeleteByCompany = async (companyId: any) => {
  const result = await ProductVariantSample.deleteMany({ company: companyId });
  if (result.deletedCount > 0) {
    return result.deletedCount.toString() + " mẫu nhóm phân loại bị xóa.";
  } else {
    return "Không có mẫu nhóm phân loại nào bị xóa.";
  }
};
