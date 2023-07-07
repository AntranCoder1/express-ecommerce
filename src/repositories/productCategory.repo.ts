import { ProductCategory } from "../models/productCategory.model";
import { productDeleteManyByCategory } from "../repositories/product.repo";
import { VietnameseStringToSlug } from "../utils/supporter.util";
export const isProductCategorySlugAvailable = async (
  slug: string,
  company: any,
  id?: any
) => {
  const productCategory = await ProductCategory.findOne({
    slug,
    company,
  });
  if (productCategory === null) {
    return true;
  } else {
    if (id) {
      return productCategory._id.toString() === id.toString();
    } else {
      return false;
    }
  }
};
export const pc_getRecommendSlug = async (name: string, company: any) => {
  let slug = VietnameseStringToSlug(name);
  let category = await ProductCategory.findOne({
    slug,
    company,
  });
  while (category) {
    slug += "-1";
    category = await ProductCategory.findOne({ slug });
  }
  return slug;
};
export const productCategoryCreate = async (body: any) => {
  const newCategory = new ProductCategory(body);
  await newCategory.save();
  return newCategory._id;
};
export const productCategoryGetBySlug = async (slug: string, company: any) => {
  const data = await ProductCategory.findOne({
    slug,
    company,
  });
  return data;
};
export const productCategoryGetListByCompany = async (company: any) => {
  const data = await ProductCategory.find({ company });
  return data;
};
export const productCategoryUpdate = async (id: any, body: any) => {
  const modified = await ProductCategory.findByIdAndUpdate(id, body);
  return modified._id;
};
export const productCategoryDeleteById = async (id: any) => {
  const result = await ProductCategory.deleteOne({ _id: id });
  if (result.deletedCount === 0) {
    throw new Error("Không tìm thấy danh mục để xóa.");
  } else {
    return "Danh mục đã được xóa.";
  }
};
export const productCategoryModifyProductQuantity = async (
  id: any,
  quantity: number
) => {
  const category = await ProductCategory.findById(id).select({ products: 1 });
  category.products += category.products + quantity >= 0 ? quantity : 0;
  await category.save();
};
export const productCategoryDeleteManyByCompany = async (companyId: any) => {
  const categories = await ProductCategory.find({ company: companyId });
  if (categories.length > 0) {
    for (const category of categories) {
      if (category.products > 0) {
        await productDeleteManyByCategory(category._id);
      }
      await ProductCategory.deleteOne({ _id: category._id });
    }
  }
  return "Các danh mục sản phẩm thuộc doanh nghiệp đã được xóa.";
};
