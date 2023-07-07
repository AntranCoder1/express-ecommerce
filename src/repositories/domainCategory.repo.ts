import { DomainCategory } from "../models/domainCategory.model";
import { DomainSubCategory } from "../models/domainSubCategory.model";
import { DomainProduct } from "../models/domainProduct.model";
import { VietnameseStringToSlug } from "../utils/supporter.util";
import mongoose from "mongoose";
export const dc_getListByDomain = async (domain: any) => {
  return await DomainCategory.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$domain", new mongoose.Types.ObjectId(domain)] }],
        },
      },
    },
    {
      $lookup: {
        from: "domain_sub_categories",
        localField: "_id",
        foreignField: "category",
        as: "domain_sub_category",
      },
    },
  ]);
};
export const dc_getListForMenu = async (domain: any, limit: number) => {
  let result = await DomainCategory.find({ domain })
    .sort({
      name: 1,
    })
    .limit(limit ? limit : 5);
  const resultWithSubs: any = [];
  for (const data of result) {
    const subs = await DomainSubCategory.find({ category: data._id });
    const cat = {
      _id: data._id,
      name: data.name,
      slug: data.slug,
      icon: data.icon,
      subs: subs && subs.length > 0 ? subs : [],
    };
    resultWithSubs.push(cat);
  }
  result = resultWithSubs;
  return result;
};
export const dc_getById = async (id: any) => {
  const result = await DomainCategory.findOne({ _id: id });
  return result;
};
export const isDomainCategorySlugAvailable = async (
  domain: any,
  slug: string,
  id?: any
) => {
  const category: any = await DomainCategory.findOne({
    domain,
    slug,
  });
  if (!category || category === null) {
    return true;
  } else {
    if (id) {
      return id.toString() && id === category._id.toString();
    } else {
      return false;
    }
  }
};
export const dc_getRecommendSlug = async (
  domain: any,
  name: string,
  catId?: any
) => {
  let slug = VietnameseStringToSlug(name);
  let available = catId
    ? await isDomainCategorySlugAvailable(domain, slug, catId)
    : await isDomainCategorySlugAvailable(domain, slug);
  while (available === false) {
    slug += "-1";
    available = catId
      ? await isDomainCategorySlugAvailable(domain, slug, catId)
      : await isDomainCategorySlugAvailable(domain, slug);
  }
  return slug;
};
export const dc_getBySlug = async (body: any) => {
  const result = await DomainCategory.findOne({
    domain: body.domain,
    slug: body.slug,
  });
  return result;
};

export const dc_getBySlugDomain = async (body: any) => {
  const result = await DomainCategory.findOne({
    domain: body.domain,
    slug: body.slug,
  }).select({ _id: 1, slug: 1, name: 1 });
  return result;
};

export const dc_create = async (body: any) => {
  const newDC = new DomainCategory(body);
  await newDC.save();
  return newDC._id;
};
export const dc_update = async (id: any, body: any) => {
  const modified: any = await DomainCategory.findByIdAndUpdate(id, body);
  return modified._id;
};
// Use when category have products
export const dc_deleteByBody = async (body: any) => {
  const category = body.category;
  const newCategory = body.newCategory ? body.newCategory : "";
  const option = body.option;
  switch (option) {
    case "delete-all": {
      await DomainProduct.deleteMany({ category });
      await DomainSubCategory.deleteMany({ category });
      break;
    }
    case "move": {
      // Delete sub categories of old category
      await DomainSubCategory.deleteMany({ category });
      // Update product quantity of new category
      const count = (
        await DomainProduct.updateMany(
          { category },
          { category: newCategory, subCategory: null }
        )
      ).modifiedCount;
      const domainCategory = await DomainCategory.findOne({
        _id: newCategory,
      }).select({ products: 1 });
      domainCategory.products += count;
      await domainCategory.save();
      break;
    }
    case "default": {
      await DomainProduct.updateMany(
        { category },
        { category: null, subCategory: null }
      );
      await DomainSubCategory.deleteMany({ category });
      break;
    }
  }
  await DomainCategory.deleteOne({ _id: category });
};
// Use when category have no product
export const dc_deleteById = async (id: any) => {
  await DomainSubCategory.deleteMany({ category: id });
  await DomainCategory.deleteOne({ _id: id });
};

export const getAllCatByDomain = (domain) => {
  return DomainCategory.find({ domain });
};
