import { ProductLinkDomain } from "../models/product-link-domain.model";
import mongoose from "mongoose";
export const getAll = (domainId: string, linkDomain, offset, page) => {
  return ProductLinkDomain.find(
    {
      domain: new mongoose.Types.ObjectId(domainId),
      linkDomain: new mongoose.Types.ObjectId(linkDomain),
    },
    { linkDomainProductId: 1 }
  )
    .populate("linkDomainProductId")
    .populate({
      path: "linkDomainProductId",
      populate: "product",
      select: "domain_price",
    })
    .skip(page * offset)
    .limit(offset);
};

export const getAllP = (domainId: string, linkDomain: string) => {
  return ProductLinkDomain.find(
    {
      domain: new mongoose.Types.ObjectId(domainId),
      linkDomain: new mongoose.Types.ObjectId(linkDomain),
    },
    { linkDomainProductId: 1 }
  )
    .populate("linkDomainProductId")
    .populate({
      path: "linkDomainProductId",
      populate: "product",
      select: "domain_price",
    });
};

export const countAll = (domainId: string, linkDomain: string) => {
  return ProductLinkDomain.find(
    {
      domain: new mongoose.Types.ObjectId(domainId),
      linkDomain: new mongoose.Types.ObjectId(linkDomain),
    },
    { linkDomainProductId: 1 }
  ).countDocuments();
};

export const create = (domainId, linkDomain, arrProduct) => {
  const arrProductId = [];
  for (const i of arrProduct) {
    const product = new ProductLinkDomain({
      domain: domainId,
      linkDomain,
      linkDomainProductId: i,
    });
    arrProductId.push(product);
  }
  return ProductLinkDomain.insertMany(arrProductId);
};

export const updateProducts = (id, productId) => {
  return ProductLinkDomain.updateOne(
    { _id: id },
    { $set: { linkDomainProductId: productId } }
  );
};

export const removeProducts = (domain, linkDomain, productId) => {
  return ProductLinkDomain.deleteOne({
    domain,
    linkDomain,
    linkDomainProductId: productId,
  });
};
