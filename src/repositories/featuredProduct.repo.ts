import { FeaturedProduct } from "../models/featuredProcuct.model";
import mongoose from "mongoose";
export const getAll = (domainId: string, offset, page) => {
  return FeaturedProduct.find(
    { domain: new mongoose.Types.ObjectId(domainId) },
    { domainProductId: 1 }
  )
    .populate("domainProductId")
    .populate({
      path: "domainProductId",
      populate: "product",
      select: "domain_price",
    })
    .skip(page * offset)
    .limit(offset);
};
export const getAllP = (domainId: string) => {
  return FeaturedProduct.find(
    { domain: new mongoose.Types.ObjectId(domainId) },
    { domainProductId: 1 }
  )
    .populate("domainProductId")
    .populate({
      path: "domainProductId",
      populate: "product",
      select: "domain_price",
    });
};

export const countAll = (domainId) => {
  return FeaturedProduct.find(
    { domain: new mongoose.Types.ObjectId(domainId) },
    { domainProductId: 1 }
  ).countDocuments();
};

export const create = (domainId, arrProduct) => {
  const arrProductId = [];
  for (const i of arrProduct) {
    const product = new FeaturedProduct({
      domain: domainId,
      domainProductId: i,
    });
    arrProductId.push(product);
  }
  return FeaturedProduct.insertMany(arrProductId);
};

export const updateProducts = (id, productId) => {
  return FeaturedProduct.updateOne(
    { _id: id },
    { $set: { domainProductId: productId } }
  );
};

export const removeProducts = (domain, productId) => {
  return FeaturedProduct.deleteOne({ domain, domainProductId: productId });
};
