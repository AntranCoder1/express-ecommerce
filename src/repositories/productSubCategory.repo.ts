import { ProductSubCategory } from "../models/productSubCategory.model";
import { productDeleteManyBySubCategory } from "./product.repo";
import { VietnameseStringToSlug } from "../utils/supporter.util";
export const isProductSubCategorySlugAvailable = async (
  slug: string,
  company: any,
  id?: any
) => {
  const productSubCategory = await ProductSubCategory.findOne({
    slug,
    company,
  });
  if (productSubCategory === null) {
    return true;
  } else {
    if (id) {
      return productSubCategory._id.toString() === id.toString();
    } else {
      return false;
    }
  }
};
export const ps_getRecommendSlug = async (name: string, company: any) => {
  let slug = VietnameseStringToSlug(name);
  let subCategory = await ProductSubCategory.findOne({
    slug,
    company,
  });
  while (subCategory) {
    slug += "-1";
    subCategory = await ProductSubCategory.findOne({ slug });
  }
  return slug;
};
export const productSubCategoryCreate = async (body: any) => {
  const newSubCategory = new ProductSubCategory(body);
  await newSubCategory.save();
  return newSubCategory._id;
};
export const productSubCategoryGetBySlug = async (
  slug: string,
  company: any
) => {
  const data = await ProductSubCategory.findOne({
    slug,
    company,
  });
  return data;
};
export const productSubCategoryGetListByCompany = async (company: any) => {
  const data = await ProductSubCategory.find({ company });
  return data;
};
export const productSubCategoryGetListByCategory = async (category: any) => {
  const data = await ProductSubCategory.find({ category });
  return data;
};
export const productSubCategoryUpdate = async (id: any, body: any) => {
  const modified = await ProductSubCategory.findByIdAndUpdate(id, body);
  return modified._id;
};
export const productSubCategoryUpdateManyByCategory = async (
  oldCategoryId: any,
  newCategoryId: any
) => {
  const modified = await ProductSubCategory.updateMany(
    { category: oldCategoryId },
    { $set: { category: newCategoryId } }
  );
  return modified;
};
export const productSubCategoryDeleteById = async (id: any) => {
  const result = await ProductSubCategory.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    throw new Error("Không tìm thấy danh mục phụ để xóa.");
  } else {
    return "Danh mục phụ đã được xóa.";
  }
};
export const productSubCategoryModifyProductQuantity = async (
  id: any,
  quantity: number
) => {
  const subCategory = await ProductSubCategory.findById(id).select({
    products: 1,
  });
  subCategory.products += subCategory.products + quantity >= 0 ? quantity : 0;
  await subCategory.save();
};
export const productSubCategoryDeleteManyByCompany = async (companyId: any) => {
  const subCategories = await ProductSubCategory.find({ company: companyId });
  if (subCategories.length > 0) {
    for (const subCategory of subCategories) {
      if (subCategory.products > 0) {
        await productDeleteManyBySubCategory(subCategory._id);
      }
    }
    const result = await ProductSubCategory.deleteMany({ company: companyId });
    if (result.deletedCount > 0) {
      return "Tất cả danh mục phụ đã được xóa.";
    }
  }
  return "Không có danh mục phụ nào bị xóa.";
};
export const productSubCategoryDeleteManyByCategory = async (
  categoryId: any
) => {
  const subCategories = await ProductSubCategory.find({ category: categoryId });
  if (subCategories.length > 0) {
    for (const subCategory of subCategories) {
      if (subCategory.products > 0) {
        await productDeleteManyBySubCategory(subCategory._id);
      }
    }
    const result = await ProductSubCategory.deleteMany({
      category: categoryId,
    });
    if (result.deletedCount > 0) {
      return "Tất cả danh mục phụ đã được xóa.";
    }
  }
  return "Không có danh mục phụ nào bị xóa.";
};
