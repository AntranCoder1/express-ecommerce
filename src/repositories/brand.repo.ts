import { Brand } from "../models/brand.model";

export const getAllBrand = (company) => {
  return Brand.find({ company }).select({
    name: 1,
    slug: 1,
    typeBrand: 1,
    imgBrand: 1,
    categories: 1,
  });
};

export const getBrandByCat = (cat) => {
  return Brand.find({ categories: cat }).select({
    name: 1,
    slug: 1,
    typeBrand: 1,
    imgBrand: 1,
    categories: 1,
  });
};

export const getOne = (brandId) => {
  return Brand.findOne({ brandId }).select({
    name: 1,
    slug: 1,
    typeBrand: 1,
    imgBrand: 1,
    categories: 1,
  });
};

export const getBBySlug = (slug) => {
  return Brand.findOne({ slug }).select({
    name: 1,
    slug: 1,
    typeBrand: 1,
    imgBrand: 1,
    categories: 1,
  });
};

export const create = (data) => {
  const brand = new Brand({
    name: data.name,
    slug: data.slug,
    typeBrand: data.typeBrand,
    categories: data.categories,
    imgBrand: data.imgBrand,
    company: data.company,
  });
  return brand.save();
};

export const updateB = (brandId, data) => {
  return Brand.findByIdAndUpdate({ _id: brandId }, { $set: data });
};

export const deleteB = (brandId) => {
  return Brand.deleteOne({ _id: brandId });
};
