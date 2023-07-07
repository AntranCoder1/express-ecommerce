import { ProductConfigToken } from "../models/productConfigToken.model";

export const create = (data: any) => {
  const newProductConfigToken = new ProductConfigToken(data);
  return newProductConfigToken.save();
};

export const findAll = () => {
  return ProductConfigToken.find();
};
