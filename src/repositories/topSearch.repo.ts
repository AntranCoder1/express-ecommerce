import { TopSearch } from "../models/topSearch.model";
import mongoose from "mongoose";
export const getAll = (domainId: string, offset, page) => {
  return TopSearch.find(
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
  return TopSearch.find(
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
  return TopSearch.find(
    { domain: new mongoose.Types.ObjectId(domainId) },
    { domainProductId: 1 }
  ).countDocuments();
};

export const create = (domainId, arrProduct) => {
  const arrProductId = [];
  for (const i of arrProduct) {
    const product = new TopSearch({
      domain: domainId,
      domainProductId: i,
    });
    arrProductId.push(product);
  }
  return TopSearch.insertMany(arrProductId);
};

export const updateProducts = (id, productId) => {
  return TopSearch.updateOne(
    { _id: id },
    { $set: { domainProductId: productId } }
  );
};

export const removeProducts = (domain, productId) => {
  return TopSearch.deleteOne({ domain, domainProductId: productId });
};
