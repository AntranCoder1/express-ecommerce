import { DomainProduct } from "../models/domainProduct.model";
import { DomainCategory } from "../models/domainCategory.model";
import { Product } from "../models/product.model";
import { DomainSubCategory } from "../models/domainSubCategory.model";
import { p_sell, p_return } from "./product.repo";
import { VietnameseStringToSlug } from "./../utils/supporter.util";
import mongoose from "mongoose";

export const dp_getListByDomain = async (domain: any) => {
  const result = await DomainProduct.find({ domain, isDeleted: false })
    .populate({
      path: "domain",
      model: "Domain",
      select: "websiteAddress _id",
    })
    .populate("product")
    .populate("domain_category")
    .populate("domain_subCategory")
    .select({
      _id: 1,
      product: 1,
      domain: 1,
      domain_price: 1,
      domain_category: 1,
      domain_subCategory: 1,
      createAt: 1,
    })
    .sort({ createdAt: -1 });
  return result;
};

export const dp_getTotalByCategory = (category: any) => {
  return DomainProduct.countDocuments({
    domain_category: category,
    isDeleted: false,
  });
};

export const dp_getListByCategory = async (category: any, offset, page) => {
  const result = await DomainProduct.find({
    domain_category: category,
    isDeleted: false,
  })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "product",
      select: "name slug _id images inStock location isDiscount discount",
      populate: "location",
    })
    .select({
      _id: 1,
      product: 1,
      domain_price: 1,
      createAt: 1,
    })
    .skip(page * offset)
    .limit(offset);
  return result;
};

export const dp_getTotalBySubCategory = (subCategory: any) => {
  return DomainProduct.countDocuments({
    domain_subCategory: subCategory,
    isDeleted: false,
  });
};

export const dp_getListBySubCategory = async (
  subCategory: any,
  offset,
  page
) => {
  const result = await DomainProduct.find({
    domain_subCategory: subCategory,
    isDeleted: false,
  })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "product",
      select: "name slug _id images inStock location isDiscount discount",
      populate: "location",
    })
    .select({
      _id: 1,
      product: 1,
      domain_price: 1,
      createAt: 1,
    })
    .skip(page * offset)
    .limit(offset);
  return result;
};
// get by SLug in dashboard have product price
export const dp_getBySlugs = async (domain: any, slug: string) => {
  return Product.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$slug", slug] }],
        },
      },
    },
    {
      $project: {
        company: 0,
        comments: 0,
        subCategory: 0,
      },
    },
    {
      $lookup: {
        from: "area_cities",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $lookup: {
        from: "product_variants",
        localField: "_id",
        foreignField: "product",
        as: "product_variant",
      },
    },

    {
      $lookup: {
        from: "domain_products",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [new mongoose.Types.ObjectId(domain), "$domain"] },
                  { $eq: ["$$productId", "$product"] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "product_versions",
              localField: "domain_productVersion.product_version_id",
              foreignField: "_id",
              as: "domain_productVersion_detail",
            },
          },
          {
            $project: {
              domain_price: 1,
              domain_category: 1,
              domain_subCategory: 1,
              domain_productVersion: 1,
              domain_productVersion_detail: 1,
              isCommission: 1,
              commissionPercent: 1,
            },
          },
        ],
        as: "domain_product",
      },
    },
    { $unwind: "$domain_product" },
  ]);
};

// get by SLug in dashboard haven't product price
export const dp_getBySlug = async (domain: any, slug: string) => {
  return Product.aggregate([
    {
      $match: {
        $expr: {
          $and: [{ $eq: ["$slug", slug] }],
        },
      },
    },
    {
      $project: {
        price: 0,
        isAllowedChangePrice: 0,
        company: 0,
        comments: 0,
        category: 0,
        subCategory: 0,
        createdAt: 0,
        updatedAt: 0,
        importPrice: 0,
      },
    },
    {
      $lookup: {
        from: "area_cities",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $lookup: {
        from: "product_variants",
        localField: "_id",
        foreignField: "product",
        as: "product_variant",
      },
    },
    {
      $lookup: {
        from: "domain_products",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [new mongoose.Types.ObjectId(domain), "$domain"] },
                  { $eq: ["$$productId", "$product"] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "product_versions",
              let: {
                productVersionId: "$domain_productVersion.product_version_id",
              },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$productVersionId"] } } },
                { $project: { price: 0, product: 0 } },
              ],
              as: "domain_productVersion_get",
            },
          },

          {
            $lookup: {
              from: "domain_categories",
              let: { categoryId: "$domain_category" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$categoryId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    slug: 1,
                  },
                },
              ],
              as: "domain_category",
            },
          },
          {
            $lookup: {
              from: "domain_sub_categories",
              let: { subCategoryId: "$domain_subCategory" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$subCategoryId", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    slug: 1,
                  },
                },
              ],

              as: "domain_subCategory",
            },
          },
          {
            $project: {
              domain_price: 1,
              domain_category: 1,
              domain_subCategory: 1,
              domain_productVersion: 1,
              domain_productVersion_get: 1,
            },
          },
        ],
        as: "domain_product",
      },
    },
    { $unwind: "$domain_product" },
  ]);
};
export const isDomainProductSlugAvailable = async (
  domain: any,
  slug: string,
  dpId?: any
) => {
  const domainProduct = await DomainProduct.findOne({
    domain,
    slug,
  }).select({ _id: 1 });
  if (!domainProduct) {
    return true;
  } else {
    if (dpId) {
      return dpId.toString() === domainProduct._id.toString();
    } else {
      return false;
    }
  }
};

export const checkProductInDomain = (domain, product) => {
  return DomainProduct.findOne({ domain, product });
};

export const dp_getRecommendSlug = async (
  domain: any,
  name: string,
  dpId?: any
) => {
  let slug = VietnameseStringToSlug(name);
  let isAvailableSlug = dpId
    ? await isDomainProductSlugAvailable(domain, slug, dpId)
    : await isDomainProductSlugAvailable(domain, slug);
  while (isAvailableSlug === false) {
    slug += "-1";
    isAvailableSlug = dpId
      ? await isDomainProductSlugAvailable(domain, slug, dpId)
      : await isDomainProductSlugAvailable(domain, slug);
  }
  return slug;
};
export const dp_create = async (body: any) => {
  const newDP: any = new DomainProduct({
    product: body.product,
    domain: body.domain,
    domain_price: body.price,
    domain_category: body.category,
    domain_subCategory: body.subCategory,
    isCommission: body.isCommission,
    commissionPercent: body.commissionPercent,
  });
  await newDP.save();

  // Increase product quantity of category
  if (newDP.category) {
    const category = await DomainCategory.findOne({ _id: newDP.category });
    category.products++;
    await category.save();
  }
  // Increase product quantity of sub category
  if (newDP.subCategory) {
    const subCategory = await DomainSubCategory.findOne({
      _id: newDP.subCategory,
    });
    subCategory.products++;
    await subCategory.save();
  }
  return newDP._id;
};

export const dp_createVersion = (id, version) => {
  return DomainProduct.findOneAndUpdate(
    { _id: id },
    { $push: { domain_productVersion: version } },
    { new: true, upsert: true }
  );
};
export const dp_update = async (id: any, body: any) => {
  const product = await DomainProduct.findOne({ _id: id });
  //#region Handle category

  if (
    product.domain_category &&
    body.category &&
    product.domain_category.toString() !== body.category.toString()
  ) {
    const oldCategory = await DomainCategory.findOne({
      _id: product.domain_category,
    }).select({ products: 1 });
    const newCategory = await DomainCategory.findOne({
      _id: body.category,
    }).select({ products: 1 });
    oldCategory.products--;
    newCategory.products++;
    await oldCategory.save();
    await newCategory.save();
  } else if (product.domain_category && !body.category) {
    const category = await DomainCategory.findOne({
      _id: product.domain_category,
    }).select({ products: 1 });
    category.products--;
    await category.save();
  } else if (!product.domain_category && body.category) {
    const category = await DomainCategory.findOne({
      _id: body.category,
    }).select({ products: 1 });
    category.products++;
    await category.save();
  }

  //#endregion
  //#region Handle sub category
  if (
    product.domain_subCategory &&
    body.subCategory &&
    product.domain_subCategory.toString() !== body.subCategory.toString()
  ) {
    const oldSubCategory = await DomainSubCategory.findOne({
      _id: product.domain_subCategory,
    }).select({ products: 1 });
    const newSubCategory = await DomainSubCategory.findOne({
      _id: body.subCategory,
    }).select({ products: 1 });
    oldSubCategory.products--;
    newSubCategory.products++;
    await oldSubCategory.save();
    await newSubCategory.save();
  } else if (product.domain_subCategory && !body.subCategory) {
    const subCategory = await DomainSubCategory.findOne({
      _id: product.domain_subCategory,
    }).select({ products: 1 });
    subCategory.products--;
    await subCategory.save();
  } else if (!product.domain_subCategory && body.subCategory) {
    const subCategory = await DomainSubCategory.findOne({
      _id: body.subCategory,
    }).select({ products: 1 });
    subCategory.products++;
    await subCategory.save();
  }

  //#endregion
  // Updating domain product
  product.domain_price = body.price;
  product.domain_category = body.category;
  product.domain_subCategory = body.subCategory;
  product.domain_productVersion = body.versions;
  product.isCommission = body.isCommission;
  product.commissionPercent = body.commissionPercent;
  await product.save();
  return product._id;
};
export const dp_delete = async (id: any) => {
  const product = await DomainProduct.findOne({ _id: id });
  //#region Handle category
  if (product.domain_category) {
    const category: any = await DomainCategory.findOne({
      _id: product.domain_category,
    }).select({ products: 1 });
    category.products--;
    await category.save();
  }
  //#endregion
  //#region Handle sub category
  if (product.domain_subCategory) {
    const subCategory: any = await DomainSubCategory.findOne({
      _id: product.domain_subCategory,
    }).select({ products: 1 });
    subCategory.products--;
    await subCategory.save();
  }
  //#endregion
  const result = await DomainProduct.updateOne(
    { _id: id },
    { $set: { isDeleted: true } }
  );
  return result;
};
export const dp_deleteMany = async (list: any) => {
  for (const item of list) {
    await dp_delete(item._id);
  }
};
export const dp_updateCompanyPrice = async (
  productId: any,
  companyPrice: number
) => {
  await DomainProduct.updateMany({ product: productId }, { companyPrice });
};

// update all products
export const dp_updateProduct = async (productId: any, data: any) => {
  return await DomainProduct.updateMany({ product: productId }, { $set: data });
};
// end update all

export const dp_sell = async (productId: any, quantity: number) => {
  return await p_sell(productId, quantity);
};
export const dp_return = async (productId: any, quantity: number) => {
  return await p_return(productId, quantity);
};
// export const dp_interval = (domainId: any) => {
//   return DomainProduct.findOne({ _id: domainId });
// };
export const dp_search = async (
  domain: any,
  text,
  categoryId,
  subCategoryId,
  orderByPrice,
  orderbyDate
) => {
  const query: any = {
    $and: [
      {
        domain: new mongoose.Types.ObjectId(domain),
      },
    ],
  };
  if (text && text.length > 0) {
    query.$and.push({ name: new RegExp(text, "i"), codeVerify: null });
  }
  if (categoryId !== "") {
    query.$and.push({ domain_category: categoryId });
  }
  if (subCategoryId !== "") {
    query.$and.push({ domain_subCategory: subCategoryId });
  }
  let sortPrice: any = 1;
  let sortDate: any = -1;
  if (orderbyDate !== "") {
    if (orderbyDate === "asc") {
      sortDate = 1;
    } else {
      sortDate = -1;
    }
  }
  if (orderByPrice !== "") {
    if (orderByPrice === "asc") {
      sortPrice = 1;
    } else {
      sortPrice = -1;
    }
    return DomainProduct.find(query)
      .select({
        _id: 1,
        product: 1,
        domain: 1,
        domain_price: 1,
        domain_category: 1,
        domain_subCategory: 1,
        createAt: 1,
      })
      .sort({ price: sortPrice, createdAt: sortDate })
      .populate("product")
      .populate("domain_category")
      .populate("domain_subCategory");
  } else {
    return DomainProduct.find(query)
      .select({
        _id: 1,
        product: 1,
        domain: 1,
        domain_price: 1,
        domain_category: 1,
        domain_subCategory: 1,
        createAt: 1,
      })
      .sort({ createdAt: sortDate })
      .populate("product")
      .populate("domain_category")
      .populate("domain_subCategory");
  }
};

export const getAllProducts = async (domain, offset, page) => {
  const result = await DomainProduct.find({ domain, isDeleted: false })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "product",
      select: "name slug _id images inStock location isDiscount discount",
      populate: "location",
    })
    .select({
      _id: 1,
      product: 1,
      domain_price: 1,
      createAt: 1,
    })
    .skip(page * offset)
    .limit(offset);
  return result;
};
export const countByDomain = async (domain) => {
  return DomainProduct.countDocuments({ domain, isDeleted: false });
};

export const getAll = async (domain, offset, page) => {
  const result = await DomainProduct.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$domain", new mongoose.Types.ObjectId(domain)] },
            {
              $eq: ["$isDeleted", false],
            },
          ],
        },
      },
    },
    { $skip: (page - 1) * offset },
    { $limit: offset },
    {
      $lookup: {
        from: "products",
        let: {
          product_id: "$product",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$product_id", "$_id"],
              },
            },
          },
          {
            $project: {
              name: 1,
              slug: 1,
              _id: 1,
              images: 1,
              inStock: 1,
              isDiscount: 1,
              discount: 1,
            },
          },
        ],
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $project: { _id: 1, product: 1, domain_price: 1, createAt: 1 } },
  ]);
  return result;
};

export const getTotalAllProducts = (domain) => {
  return DomainProduct.countDocuments({ domain, isDeleted: false });
};

export const getProduct = async (arrDomainId) => {
  return DomainProduct.find({
    domain: { $in: arrDomainId },
    isCommission: true,
    commissionPercent: { $gt: 0 },
    isDeleted: false,
  });
};

export const countProductByCat = async (domain, arrCat) => {
  const result = DomainProduct.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $in: ["$domain_category", arrCat] },
            {
              $eq: ["$domain", new mongoose.Types.ObjectId(domain)],
            },
            {
              $eq: ["$isDeleted", false],
            },
          ],
        },
      },
    },
    { $group: { _id: "$domain_category", products: { $sum: 1 } } },
  ]);
  return result;
};

export const countProductBySubCat = async (domain, arrSubCat) => {
  return DomainProduct.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $in: ["$domain_subCategory", arrSubCat] },
            {
              $eq: ["$domain", new mongoose.Types.ObjectId(domain)],
            },
            {
              $eq: ["$isDeleted", false],
            },
          ],
        },
      },
    },
    { $group: { _id: "$domain_category", products: { $sum: 1 } } },
  ]);
};

export const getCommissionPercent = (id) => {
  return DomainProduct.findOne({ _id: id }).select({ commissionPercent: 1 });
};

export const getQuantity = async (arrProductDomain) => {
  const result = await DomainProduct.aggregate([
    {
      $match: {
        $expr: {
          $in: ["$_id", arrProductDomain],
        },
      },
    },
    {
      $lookup: {
        from: "products",
        let: {
          product_id: "$product",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$product_id", "$_id"],
              },
            },
          },
          {
            $project: { inStock: 1, name: 1 },
          },
        ],
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $project: { product: 1 } },
  ]);
  return result;
};

export const getTotalByArrDomain = async (arrDomain) => {
  return DomainProduct.countDocuments({
    domain: { $in: arrDomain },
    isDeleted: false,
  });
};

export const getAllByArrDomain = async (arrDomain, offset, page) => {
  const result = await DomainProduct.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $in: ["$domain", arrDomain] },
            {
              $eq: ["$isDeleted", false],
            },
          ],
        },
      },
    },
    { $skip: (page - 1) * offset },
    { $limit: offset },
    {
      $lookup: {
        from: "products",
        let: {
          product_id: "$product",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$product_id", "$_id"],
              },
            },
          },
          {
            $project: {
              name: 1,
              slug: 1,
              _id: 1,
              images: 1,
              inStock: 1,
              isDiscount: 1,
              discount: 1,
            },
          },
        ],
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $project: { _id: 1, product: 1, domain_price: 1, createAt: 1 } },
  ]);
  return result;
};
