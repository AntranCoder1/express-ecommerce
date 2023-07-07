import { Request, Response } from "express";
import {
  dp_create,
  dp_update,
  dp_delete,
  dp_deleteMany,
  dp_getListByDomain,
  dp_getBySlug,
  dp_getBySlugs,
  dp_getRecommendSlug,
  dp_getListByCategory,
  dp_getListBySubCategory,
  isDomainProductSlugAvailable,
  dp_search,
  dp_getTotalByCategory,
  dp_getTotalBySubCategory,
  dp_createVersion,
  checkProductInDomain,
} from "../repositories/domainProduct.repo";
import * as domainProductRepo from "../repositories/domainProduct.repo";
import * as domainCategoryRepo from "../repositories/domainCategory.repo";
import * as domainSubCategoryRepo from "../repositories/domainSubCategory.repo";
import * as domainRepo from "../repositories/domain.repo";
import getHostname from "../modules/hostname.module";

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const offset = req.query.offset;
    const page = req.query.page;
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const result = await domainProductRepo.getAllProducts(
      getDomain._id,
      offset,
      page
    );
    const total = await domainProductRepo.getTotalAllProducts(getDomain._id);
    res.status(200).json({ data: result, total });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getListByDomain = async (req: Request, res: Response) => {
  try {
    const result = await dp_getListByDomain(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCategory = async (req: Request, res: Response) => {
  const slug = req.query.slug as string;
  const offset = req.query.offset;
  const page = req.query.page;
  const hostname = req.headers.origin as string;
  try {
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }

    const data = {
      domain: getDomain._id,
      slug,
    };
    const getCategory: any = await domainCategoryRepo.dc_getBySlug(data);
    const result = await dp_getListByCategory(getCategory._id, offset, page);
    const total = await dp_getTotalByCategory(getCategory._id);
    res.status(200).json({ data: result, total, category: getCategory });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListBySubCategory = async (req: Request, res: Response) => {
  const slug = req.query.slug as string;
  const offset = req.query.offset;
  const page = req.query.page;
  const hostname = req.headers.origin as string;
  try {
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const data = {
      domain: getDomain._id,
      slug,
    };

    const getSubCategory: any = await domainSubCategoryRepo.ds_getBySlugDomain(
      data
    );
    const result = await dp_getListBySubCategory(
      getSubCategory._id,
      offset,
      page
    );
    const total = await dp_getTotalBySubCategory(getSubCategory._id);
    res.status(200).json({ data: result, total, category: getSubCategory });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getBySlug = async (req: Request, res: Response) => {
  const domain = req.body.domain;
  const slug = req.body.slug;
  try {
    const getDomain = await domainRepo.domainGetByAddress(domain);
    const result = await dp_getBySlug(getDomain._id, slug);
    res.status(200).json({ data: result[0] });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getBySlugs = async (req: Request, res: Response) => {
  const domain = req.body.domain;
  const slug = req.body.slug;
  try {
    const getDomain = await domainRepo.domainGetByAddress(domain);
    const result = await dp_getBySlugs(getDomain._id, slug);
    const product_version = await getProductVersion(result[0].domain_product);
    result[0].domain_product.product_version = product_version;
    delete result[0].domain_product.domain_productVersion_detail;
    delete result[0].domain_product.domain_productVersion;
    res.status(200).json({ data: result[0] });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

const getProductVersion = (result: any) => {
  const product_version = [];
  const detail = result.domain_productVersion_detail;
  const domain_productVersion = result.domain_productVersion;
  for (const i of domain_productVersion) {
    for (const j of detail) {
      if (i.product_version_id.valueOf() === j._id.valueOf()) {
        product_version.push({
          attributes: j.attributes,
          image: j.image,
          inStock: j.inStock,
          domain_product_price: i.domain_product_price,
          product_version_id: i.product_version_id,
          _id: i._id,
        });
      }
    }
  }
  return product_version;
};

export const getRecommendSlug = async (req: Request, res: Response) => {
  try {
    const result = req.body._id
      ? await dp_getRecommendSlug(req.body.domain, req.body.name, req.body._id)
      : await dp_getRecommendSlug(req.body.domain, req.body.name);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    // const product = req.body.product;
    const domain = req.body.domain;
    // const checkProductDomain = await checkProductInDomain(domain, product);
    // if (checkProductDomain) {
    //   throw new Error("Sản phẩm đã đc thêm vào cửa hàng");
    // }
    const domain_version = [];
    const version = req.body.versions;
    for (const i of version) {
      domain_version.push({
        product_version_id: i._id,
        domain_product_price: i.price,
      });
    }
    const body = {
      product: req.body.product,
      domain: req.body.domain,
      price: req.body.price,
      category: req.body.category ? req.body.category : null,
      subCategory: req.body.subCategory ? req.body.subCategory : null,
      isCommission: req.body.isCommission,
      commissionPercent: Number(req.body.commissionPercent),
    };
    const result = await dp_create(body);
    const addVersion = await dp_createVersion(result._id, domain_version);
    updateCountCatSubCatDomain(domain);
    if (result && addVersion) {
      res.status(200).send({ status: "success" });
    } else {
      throw new Error("Đã có lỗi xảy ra khi tạo sản phẩm mới");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const domain_version = [];
    const domain = req.body.domain;
    const version = req.body.versions;
    const isCommission = req.body.isCommission;
    const commissionPercent = Number(req.body.commissionPercent);
    for (const i of version) {
      domain_version.push({
        product_version_id: i._id,
        domain_product_price: i.price,
      });
    }
    const body = {
      price: req.body.price,
      category: req.body.category ? req.body.category : null,
      subCategory: req.body.subCategory ? req.body.subCategory : null,
      versions: domain_version,
      isCommission,
      commissionPercent,
    };
    const result = await dp_update(req.body._id, body);
    updateCountCatSubCatDomain(domain);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const domain = req.body.domain;
    const result = await dp_delete(req.params.id);
    updateCountCatSubCatDomain(domain);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteList = async (req: Request, res: Response) => {
  try {
    await dp_deleteMany(req.body.list);
    updateCountCatSubCatDomain(req.body.domain);
    res.status(200).json({ data: "Các sản phẩm của cửa hàng đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const search = async (req: Request, res: Response) => {
  const domain = req.body.domain;
  const text = req.body.text;
  const categoryId = req.body.categoryId;
  const subCategoryId = req.body.subCategoryId;
  const orderByPrice = req.body.orderByPrice;
  const orderbyDate = req.body.orderbyDate;
  try {
    const data = await dp_search(
      domain,
      text,
      categoryId,
      subCategoryId,
      orderByPrice,
      orderbyDate
    );
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

const updateCountCatSubCatDomain = async (domain) => {
  const getAllCatInDomain = await domainCategoryRepo.getAllCatByDomain(domain);
  const getAllSubCatInDomain = await domainSubCategoryRepo.getAllCatByDomain(
    domain
  );
  const arrCatId = [];
  const arrSubCatId = [];
  for (const i of getAllCatInDomain) {
    arrCatId.push(i._id);
  }
  for (const i of getAllSubCatInDomain) {
    arrSubCatId.push(i._id);
  }

  const getcountProductByCat = await domainProductRepo.countProductByCat(
    domain,
    arrCatId
  );
  const getcountProductBySubCat = await domainProductRepo.countProductBySubCat(
    domain,
    arrSubCatId
  );

  for (const i of getcountProductByCat) {
    const body = {
      products: i.products,
    };
    const updateCountInCat = await domainCategoryRepo.dc_update(i._id, body);
  }
  for (const i of getcountProductBySubCat) {
    const body = {
      products: i.products,
    };
    const updateCountInCat = await domainSubCategoryRepo.ds_update(i._id, body);
  }
};
