import { Request, Response } from "express";
import {
  ds_getListByCategory,
  ds_getById,
  ds_getBySlug,
  ds_getRecommendSlug,
  isDomainSubCategorySlugAvailable,
  ds_create,
  ds_update,
  ds_deleteById,
  ds_deleteByBody,
} from "../repositories/domainSubCategory.repo";
export const getListByCategory = async (req: Request, res: Response) => {
  try {
    const result = await ds_getListByCategory(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getById = async (req: Request, res: Response) => {
  try {
    const result = await ds_getById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const body = {
      category: req.body.category,
      slug: req.body.slug,
    };
    const result = await ds_getBySlug(body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getRecommendSlug = async (req: Request, res: Response) => {
  try {
    const result = req.body._id
      ? await ds_getRecommendSlug(req.body.domain, req.body.name, req.body._id)
      : await ds_getRecommendSlug(req.body.domain, req.body.name);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      domain: req.body.domain,
      name: req.body.name,
      category: req.body.category,
      slug: req.body.slug,
    };
    const isSlugAvailable = await isDomainSubCategorySlugAvailable(
      body.domain,
      body.slug
    );
    if (isSlugAvailable === true) {
      const result = await ds_create(body);
      res.status(201).json({ data: result });
    } else {
      throw new Error("Đường dẫn đã được sử dụng bởi danh mục phụ khác.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateByBody = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
      slug: req.body.slug,
    };
    const isSlugAvailable = await isDomainSubCategorySlugAvailable(
      req.body.domain,
      body.slug,
      req.body._id
    );
    if (isSlugAvailable === true) {
      const result = await ds_update(req.body._id, body);
      res.status(200).json({ data: result });
    } else {
      throw new Error("Đường dẫn đã được sử dụng bởi danh mục phụ khác.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteByBody = async (req: Request, res: Response) => {
  try {
    const body = {
      subCategory: req.body.subCategory,
      newSubCategory: req.body.newSubCategory,
      option: req.body.option,
    };
    await ds_deleteByBody(body);
    res.status(200).json({ data: "Danh mục phụ đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    await ds_deleteById(req.params.id);
    res.status(200).json({ data: "Danh mục phụ đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
