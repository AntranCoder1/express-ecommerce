import { CustomerFavourite } from "../models/customerFavourite.model";
export const cf_list = async (customer: any) => {
  const data = await CustomerFavourite.findOne({ customer }).populate({
    path: "products",
    model: "DomainProduct",
    select: "domain name slug price inStock category subCategory images",
    populate: [
      {
        path: "domain",
        model: "Domain",
        select: "name websiteAddress",
      },
      {
        path: "category",
        model: "DomainCategory",
        select: "name slug",
      },
      {
        path: "subCategory",
        model: "DomainSubCategory",
        select: "name slug",
      },
    ],
  });
  return data && data.products ? data.products : [];
};
export const cf_update = async (productId: any, customer: any) => {
  const cf = await CustomerFavourite.findOne({ customer });
  if (!cf) {
    const newCF = new CustomerFavourite({
      customer,
      products: [productId],
    });
    await newCF.save();
    return newCF._id;
  } else {
    const index = cf.products.findIndex(
      (item: any) => item.toString() === productId.toString()
    );
    if (index >= 0) {
      cf.products.splice(index, 1);
    } else {
      cf.products.push(productId);
    }
    await cf.save();
    return cf._id;
  }
};
export const isFavourite = async (body: any) => {
  const customer = body.customer;
  const productId = body.product;
  const data: any = await CustomerFavourite.findOne({ customer });

  if (!data || !data.products) {
    return false;
  } else {
    return data.products.findIndex((item: any) => item === productId) >= 0;
  }
};
