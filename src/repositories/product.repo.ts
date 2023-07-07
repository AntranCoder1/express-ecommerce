import { Product } from "../models/product.model";
import { ProductVariant } from "../models/productVariant.model";
import { DomainProduct } from "../models/domainProduct.model";
import { productVersionDeleteManyByProduct } from "./productVersion.repo";
import { removeFile } from "../utils/upload.util";
import mongoose from "mongoose";

export const productGetById = async (id: any) => {
  const data = await Product.findOne({
    _id: id,
  }).populate([
    {
      path: "category",
      model: "ProductCategory",
    },
    {
      path: "subCategory",
      model: "ProductSubCategory",
    },
    {
      path: "company",
      model: "Company",
      select: "_id name",
    },
  ]);
  return data;
};
export const isProductSlugAvailable = async (
  companyId: any,
  slug: string,
  productId?: string
) => {
  return Product.findOne({ company: companyId, slug });
};
export const productGetRecommendSlug = async (
  companyId: any,
  slug: string,
  productId?: string
) => {
  let recommendSlug: string = slug;
  let available: any = productId
    ? await isProductSlugAvailable(companyId, slug, productId)
    : await isProductSlugAvailable(companyId, slug);
  const index = 1;
  while (available === false) {
    recommendSlug = slug + "-" + index.toString();
    available = productId
      ? await isProductSlugAvailable(companyId, recommendSlug, productId)
      : await isProductSlugAvailable(companyId, recommendSlug);
  }
  return recommendSlug;
};
export const productGetBySlug = async (body: any) => {
  const data = await Product.findOne({
    slug: body.slug,
    company: body.company,
  }).populate([
    {
      path: "category",
      model: "ProductCategory",
    },
    {
      path: "subCategory",
      model: "ProductSubCategory",
    },
    {
      path: "company",
      model: "Company",
      select: "_id name",
    },
  ]);
  return data;
};
export const productGetListByCategory = async (categoryId: any) => {
  const fieldsSelect = {};
  const data = await Product.find({ category: categoryId })
    .select(fieldsSelect)
    .populate([
      {
        path: "subCategory",
        model: "ProductSubCategory",
      },
      {
        path: "company",
        model: "Company",
        select: "_id name",
      },
    ]);
  return data;
};
export const productGetListBySubCategory = async (subCategoryId: any) => {
  const fieldsSelect = {};
  const data = await Product.find({ subCategory: subCategoryId })
    .select(fieldsSelect)
    .populate([
      {
        path: "category",
        model: "ProductCategory",
      },
      {
        path: "company",
        model: "Company",
        select: "_id name",
      },
    ]);
  return data;
};
export const productGetListByCompany = async (companyId: any) => {
  const data = await Product.find({ company: companyId }).populate([
    {
      path: "category",
      model: "ProductCategory",
    },
    {
      path: "subCategory",
      model: "ProductSubCategory",
    },
  ]);
  return data;
};

export const searchProductCompany = async (
  companyId: any,
  text,
  categoryId,
  subCategoryId,
  orderByPrice,
  orderbyDate
) => {
  const query: any = {
    $and: [
      {
        company: companyId,
      },
    ],
  };
  if (text && text.length > 0) {
    query.$and.push({ name: new RegExp(text, "i"), codeVerify: null });
  }
  if (categoryId !== "") {
    query.$and.push({ category: categoryId });
  }
  if (subCategoryId !== "") {
    query.$and.push({ subCategory: subCategoryId });
  }
  let sortPrice: any = 1;
  let sortDate: any = 1;
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
    return Product.find(query).sort({ price: sortPrice, createdAt: sortDate });
  } else {
    return Product.find(query).sort({ createdAt: sortDate });
  }
};

export const productCreate = async (body: any) => {
  const newProduct = new Product(body);
  await newProduct.save();
  return newProduct._id;
};
export const productUpdate = async (id: any, body: any) => {
  const modified = await Product.findByIdAndUpdate(id, body);
  return modified._id;
};
export const productUpdateManyByCategory = async (
  oldCategoryId: any,
  newCategoryId: any
) => {
  const modified = await Product.updateMany(
    { category: oldCategoryId },
    { $set: { category: newCategoryId } }
  );
  return modified;
};
export const productUpdateManyBySubCategory = async (
  oldSubCategoryId: any,
  newSubCategoryId: any
) => {
  const modified = await Product.updateMany(
    { subCategory: oldSubCategoryId },
    { $set: { subCategory: newSubCategoryId } }
  );
  return modified;
};
export const productDelete = async (product: any) => {
  // Delete domain products
  await DomainProduct.deleteMany({ product: product._id });
  // Delete variants
  await ProductVariant.deleteMany({ product: product._id });
  // Delete versions
  await productVersionDeleteManyByProduct(product._id);
  // Delete company product
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      removeFile(image.path);
    }
  }
  const result = await Product.deleteOne({ _id: product._id });
  if (result.deletedCount > 0) {
    return "Xóa sản phẩm thành công.";
  } else {
    return "Không có sản phẩm nào bị xóa.";
  }
};
export const productDeleteManyByCategory = async (categoryId: any) => {
  const products = await Product.find({ category: categoryId });
  for (const product of products) {
    await productDelete(product);
  }
  return "Các sản phẩm trong danh mục đã được xóa.";
};
export const productDeleteManyBySubCategory = async (subCategoryId: any) => {
  const products = await Product.find({ subCategory: subCategoryId });
  for (const product of products) {
    await productDelete(product);
  }
  return "Các sản phẩm trong danh mục phụ đã được xóa.";
};
export const productDeleteImages = async (list: any) => {
  const product = await Product.findOne({ _id: list[0].product }).select({
    images: 1,
  });
  if (product) {
    const imagesCleared = [];

    for (const image of product.images) {
      let matched = false;
      for (const item of list) {
        if (item.path === image.path) {
          matched = true;
          break;
        }
      }
      if (matched === false) {
        imagesCleared.push(image);
      }
    }
    await Product.findByIdAndUpdate(
      list[0].product,
      { images: imagesCleared },
      { new: true }
    );
    for (const item of list) {
      removeFile(item.path);
    }
  }
};
export const p_sell = async (id: any, quantity: number) => {
  const product = await Product.findOne({ _id: id }).select({ inStock: 1 });
  const amount = product.inStock - quantity;
  if (amount < 0) {
    throw new Error("Số lượng sản phẩm còn lại trong kho không đủ để bán.");
  } else {
    product.inStock = amount;
    await product.save();
    await DomainProduct.updateMany({ product: id }, { inStock: amount });
    return "Bán sản phẩm thành công.";
  }
};
export const p_return = async (id: any, quantity: number) => {
  const product = await Product.findOne({ _id: id }).select({ inStock: 1 });
  const amount = product.inStock + quantity;
  product.inStock = amount;
  await product.save();
  await DomainProduct.updateMany({ product: id }, { inStock: amount });
  return "Hoàn trả hàng thành công";
};

export const checkBrand = (brand) => {
  return Product.find({ brand }).countDocuments();
};

export const updateInStock = (id, data) => {
  return Product.updateOne({ _id: id }, { $set: data });
};

export const deleteProduct = async (productId: any) => {
  return Product.deleteOne({ _id: productId });
};

export const findDomainProduct = async (productId: string) => {
  const productQuery = [];
  productQuery.push({
    $eq: ["$_id", new mongoose.Types.ObjectId(productId)],
  });
  const domainProductQuery = [
    {
      $match: {
        $expr: {
          $and: productQuery,
        },
      },
    },
    {
      $lookup: {
        from: "domain_products",
        localField: "_id",
        foreignField: "product",
        as: "domainProduct",
      },
    },
  ];

  const result = await Product.aggregate(domainProductQuery);
  return result;
};
