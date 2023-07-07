import { ProductVariant } from "../models/productVariant.model";
export const isAvailableVariant = async (
  productId: any,
  name: string,
  id?: any
) => {
  const variant = await ProductVariant.findOne({
    product: productId,
    name,
  });
  if (!variant) {
    return true;
  } else {
    if (id) {
      return id.toString() === variant._id.toString();
    } else {
      return false;
    }
  }
};
export const productVariantGetListByProduct = async (productId: any) => {
  const notShow = { product: 0 };
  const result = await ProductVariant.find({ product: productId }).select(
    notShow
  );
  return result;
};
export const productVariantGetById = async (id: any) => {
  const variant = await ProductVariant.findOne({ _id: id });
  return variant;
};
export const productVariantCreate = async (body: any) => {
  const newVariant = new ProductVariant(body);
  await newVariant.save();
  return newVariant._id;
};
export const productVariantUpdate = async (id: any, body: any) => {
  const modified = await ProductVariant.findByIdAndUpdate(id, body);
  return modified._id;
};
export const productVariantDelete = async (id: any) => {
  // Delete variant
  const result = await ProductVariant.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    return "Nhóm phân loại sản phẩm đã được xóa.";
  } else {
    return "Không có nhóm phân loại nào bị xóa.";
  }
};
export const productVariantDeleteMany = async (list: any) => {
  for (const item of list) {
    await ProductVariant.deleteOne({ _id: item._id });
  }
};
