import { Request, Response } from "express";
import {
  dc_getListByDomain,
  dc_getListForMenu,
  dc_getById,
  dc_getRecommendSlug,
  dc_getBySlug,
  isDomainCategorySlugAvailable,
  dc_create,
  dc_update,
  dc_deleteById,
  dc_deleteByBody,
} from "../repositories/domainCategory.repo";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
  customFileDiskStorage,
  newDateTimeString,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";
export const getListByDomain = async (req: Request, res: Response) => {
  try {
    const result = await dc_getListByDomain(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListForMenu = async (req: Request, res: Response) => {
  try {
    const result = await dc_getListForMenu(req.body.domain, req.body.limit);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getById = async (req: Request, res: Response) => {
  try {
    const result = await dc_getById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getRecommendSlug = async (req: Request, res: Response) => {
  try {
    const result = req.body._id
      ? await dc_getRecommendSlug(req.body.domain, req.body.name, req.body._id)
      : await dc_getRecommendSlug(req.body.domain, req.body.name);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const body = {
      domain: req.body.domain,
      slug: req.body.slug,
    };
    const result = await dc_getBySlug(body);
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
      slug: req.body.slug,
      icon: req.body.icon,
    };
    const isSlugAvailable = await isDomainCategorySlugAvailable(
      body.domain,
      body.slug
    );
    if (isSlugAvailable === true) {
      const result = await dc_create(body);
      res.status(201).json({ data: result });
    } else {
      throw new Error("Đường dẫn đã được sử dụng bởi danh mục khác");
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
      icon: req.body.icon,
    };
    const isSlugAvailable = await isDomainCategorySlugAvailable(
      req.body.domain,
      body.slug,
      req.body._id
    );

    if (isSlugAvailable === true) {
      const result = await dc_update(req.body._id, body);
      res.status(200).json({ data: result });
    } else {
      throw new Error("Đường dẫn đã được sử dụng bởi danh mục khác");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    await dc_deleteById(req.params.id);
    res.status(200).json({ data: "Danh mục đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteByBody = async (req: Request, res: Response) => {
  try {
    const body = {
      category: req.body.category,
      newCategory: req.body.newCategory,
      option: req.body.option,
    };
    await dc_deleteByBody(body);
    res.status(200).json({ data: "Danh mục đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadIcon = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "domain-product-icon", true);
    const fileStorage = customFileDiskStorage(
      file,
      "domain-product-icon",
      "DomainProductIcon_" + newDateTimeString()
    );

    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;

    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      fs.copyFileSync(tempSrc, newDest);
      fs.unlinkSync(tempSrc);
      const name = fileStorage.filename;
      res.status(200).json({ status: "success", name });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "domain-product-icon");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh của phiên bản sản phẩm.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
