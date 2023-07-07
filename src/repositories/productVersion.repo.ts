import { ProductVersion } from "../models/productVersion.model";

import { removeFile } from "../utils/upload.util";
export const productVersionGetById = async (productVersionId: any) => {
  const data = await ProductVersion.findOne({ _id: productVersionId });
  return data;
};
export const productVersionGetListByProduct = async (productId: any) => {
  const data = await ProductVersion.find({ product: productId }).sort({
    attributes: 1,
  });
  return data;
};
export const productVersionCreate = async (body: any) => {
  const newProductVersion = new ProductVersion(body);
  await newProductVersion.save();
  return newProductVersion._id;
};
export const productVersionUpdate = async (
  productVersionId: any,
  body: any
) => {
  const modified = await ProductVersion.findByIdAndUpdate(
    productVersionId,
    body
  );
  return modified._id;
};
export const productVersionDeleteById = async (productVersionId: any) => {
  const version = await ProductVersion.findOne({ _id: productVersionId });
  if (!version || version === undefined) {
    throw new Error("Không tìm thấy phiên bản của sản phẩm để xóa.");
  }
  if (version.image) {
    removeFile(version.image.path);
  }
  await ProductVersion.deleteOne({ _id: productVersionId });
  return "Phiên bản của sản phẩm đã được xóa thành công.";
};
export const productVersionDeleteMany = async (list: any) => {
  for (const item of list) {
    if (item.image) {
      removeFile(item.image.path);
    }
    await ProductVersion.deleteOne({ _id: item._id });
  }
};
export const productVersionDeleteManyByProduct = async (productId: any) => {
  const versions = await ProductVersion.find({ product: productId });
  for (const version of versions) {
    if (version.image) {
      removeFile(version.image.path);
    }
    await ProductVersion.deleteOne({ _id: version._id });
  }
  return "Các phiên bản của sản phẩm đã được xóa.";
};
export const productVersionDeleteImages = async (list: any) => {
  for (const image of list) {
    const version = await ProductVersion.findOne({ _id: image.version });
    version.image = version.image.path === image.path ? {} : version.image;
    await version.save();
    removeFile(image.path);
  }
};

export const getQuantity = async (arrProductVersion) => {
  const result = await ProductVersion.aggregate([
    {
      $match: {
        $expr: {
          $in: ["$_id", arrProductVersion],
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
            $project: { name: 1 },
          },
        ],
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $project: { product: 1, attributes: 1, inStock: 1 } },
  ]);
  return result;
};

export const updateInStock = (id, data) => {
  return ProductVersion.updateOne({ _id: id }, { $set: data });
};

export const findWithProductId = (arr: any) => {
  return ProductVersion.find({ product: { $in: arr } }).select({
    _id: 1,
    product: 1,
    price: 1,
    attributes: 1,
    inStock: 1,
    image: 1,
  });
};
