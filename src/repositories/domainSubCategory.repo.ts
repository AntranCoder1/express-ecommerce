import { DomainProduct } from "../models/domainProduct.model";
import { DomainCategory } from "../models/domainCategory.model";
import { DomainSubCategory } from "../models/domainSubCategory.model";
import { VietnameseStringToSlug } from "../utils/supporter.util";
export const ds_getListByCategory = async (category: any) => {
  const result = await DomainSubCategory.find({ category });
  return result;
};
export const ds_getById = async (id: any) => {
  const result = await DomainSubCategory.findOne({ _id: id }).populate(
    "category"
  );
  return result;
};
export const ds_getBySlug = async (body: any) => {
  const result = await DomainSubCategory.findOne({
    domain: body.domain,
    slug: body.slug,
  }).populate("category");
  return result;
};

export const ds_getBySlugDomain = async (body: any) => {
  const result = await DomainSubCategory.findOne({
    domain: body.domain,
    slug: body.slug,
  })
    .populate({
      path: "category",
      model: "DomainCategory",
      select: "_id name slug",
    })
    .select({ _id: 1, name: 1, slug: 1 });
  return result;
};
export const isDomainSubCategorySlugAvailable = async (
  domain: any,
  slug: string,
  id?: any
) => {
  const subCategory = await DomainSubCategory.findOne({
    domain,
    slug,
  });

  if (!subCategory) {
    return true;
  } else {
    if (id) {
      return id.toString() === subCategory._id.toString();
    } else {
      return false;
    }
  }
};
export const ds_getRecommendSlug = async (
  domain: any,
  name: string,
  subId?: any
) => {
  let slug = VietnameseStringToSlug(name);
  let available = subId
    ? await isDomainSubCategorySlugAvailable(domain, slug, subId)
    : await isDomainSubCategorySlugAvailable(domain, slug);
  while (available === false) {
    slug += "-1";
    available = subId
      ? await isDomainSubCategorySlugAvailable(domain, slug, subId)
      : await isDomainSubCategorySlugAvailable(domain, slug);
  }
  return slug;
};
export const ds_create = async (body: any) => {
  const newDS = new DomainSubCategory(body);
  await newDS.save();
  return newDS._id;
};
export const ds_update = async (id: any, body: any) => {
  const modified: any = await DomainSubCategory.findByIdAndUpdate(id, body);
  return modified._id;
};
// Use when sub caegory have products
export const ds_deleteByBody = async (body: any) => {
  const subCategory = body.subCategory;
  const newSubCategory = body.newSubCategory;
  const option = body.option;
  switch (option) {
    case "delete-all": {
      // Delete products of sub category
      const count = (
        await DomainProduct.deleteMany({ domain_subCategory: subCategory })
      ).deletedCount;
      // Decrease product quantity of parent category
      const domainSubCategory = await DomainSubCategory.findOne({
        _id: subCategory,
      }).select({ category: 1 });
      const category = await DomainCategory.findOne({
        _id: domainSubCategory.category,
      }).select({ products: 1 });
      category.products -= count;
      await category.save();
      break;
    }
    case "move": {
      const count = (
        await DomainProduct.updateMany(
          { domain_subCategory: subCategory },
          { domain_subCategory: newSubCategory }
        )
      ).modifiedCount;
      const domainSubCategory = await DomainSubCategory.findOne({
        _id: newSubCategory,
      }).select({ products: 1 });
      domainSubCategory.products += count;
      await domainSubCategory.save();
      break;
    }
    case "default": {
      await DomainProduct.updateMany({ subCategory }, { subCategory: null });
      break;
    }
  }
  await DomainSubCategory.deleteOne({ _id: subCategory });
};
// Use when sub category have no product
export const ds_deleteById = async (id: any) => {
  await DomainSubCategory.deleteOne({ _id: id });
};

export const getAllCatByDomain = (domain) => {
  return DomainSubCategory.find({ domain });
};
