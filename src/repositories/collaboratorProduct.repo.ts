import { CollaboratorProduct } from "../models/collaboratorProduct.model";
import { DomainProduct } from "../models/domainProduct.model";
export const createCollaboratorProduct = (body) => {
  const newCollaboratorProduct = new CollaboratorProduct(body);
  return newCollaboratorProduct.save();
};

export const checkCollaboratorProduct = (collaborator, domainProductId) => {
  return CollaboratorProduct.countDocuments({
    collaborator,
    domainProduct: domainProductId,
  });
};

export const getProductDomain = (collaborator, domain) => {
  return CollaboratorProduct.find({ collaborator, domain });
};

export const getAllProduct = (collaborator) => {
  return CollaboratorProduct.find({ collaborator })
    .populate({
      path: "domain",
      model: "Domain",
      select: "websiteAddress name _id",
    })
    .populate({
      path: "domainProduct",
      model: "DomainProduct",
      populate: [
        {
          path: "domain_category",
          model: "DomainCategory",
          select: "name slug",
        },
        {
          path: "domain_subCategory",
          model: "DomainSubCategory",
          select: "name slug",
        },
        {
          path: "product",
          model: "Product",
          select: "name images slug inStock",
        },
      ],
    });
};

export const dp_getListByDomain = async (domain: any) => {
  const result = await DomainProduct.find({ domain, isCommission: true })
    .populate({
      path: "domain",
      model: "Domain",
      select: "websiteAddress _id",
    })
    .populate({
      path: "product",
      model: "Product",
      select: "name images slug _id inStock",
    })
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
      isCommission: 1,
      commissionPercent: 1,
    })
    .sort({ createdAt: -1 });
  return result;
};

export const getProductByToken = (token: string) => {
  return CollaboratorProduct.find({ token });
};
