import { Cart } from "../models/cart.model";
import mongoose from "mongoose";

export const getCart = (customer) => {
  return Cart.find(customer);
};

export const getAll = (customer, domain) => {
  return Cart.find({ customer, domain })
    .populate({
      path: "item",
      populate: {
        path: "product",
        model: "Product",
        select: {
          _id: 1,
          name: 1,
          slug: 1,
          discount: 1,
          isDiscount: 1,
          images: 1,
          inStock: 1,
        },
      },
    })
    .populate({
      path: "item",
      populate: {
        path: "productDomain",
        model: "DomainProduct",
        select: { _id: 1, domain_price: 1 },
      },
    })
    .populate({
      path: "item",
      populate: {
        path: "product_version",
        model: "ProductVersion",
        select: { _id: 1, attributes: 1, price: 1, image: 1, inStock: 1 },
      },
    });
};

export const countCart = (customer) => {
  return Cart.countDocuments({ customer });
};

export const createCart = (id, domain, item) => {
  const cart = new Cart({
    customer: id,
    domain,
    item,
  });
  return cart.save();
};

export const updateC = (domain, customer, item) => {
  return Cart.updateOne({ domain, customer }, { $set: { item } });
};
