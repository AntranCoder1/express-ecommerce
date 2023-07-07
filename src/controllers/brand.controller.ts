import { Request, Response } from "express";
import * as brandRepo from "../repositories/brand.repo";
import * as productRepo from "../repositories/product.repo";
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
export const getAll = async (req: Request, res: Response) => {
  const company = req.body.user._id;
  try {
    const brand = await brandRepo.getAllBrand(company);
    if (brand) {
      res.status(200).send({ status: "success", data: brand });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getByCat = async (req: Request, res: Response) => {
  const category = req.params.id;
  try {
    const brand = await brandRepo.getBrandByCat(category);
    if (brand) {
      res.status(200).send({ status: "success", data: brand });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  const brandId = req.params.id;
  try {
    const brand = await brandRepo.getOne(brandId);
    if (brand) {
      res.status(200).send({ status: "success", brand });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  try {
    const brand = await brandRepo.getBBySlug(slug);
    if (brand) {
      res.status(200).send({ status: "success", brand });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response) => {
  const name = req.body.name;
  const slug = req.body.slug;
  const typeBrand = req.body.typeBrand;
  const categories = req.body.categories;
  const imgBrand = req.body.icon;
  const company = req.body.user._id;
  try {
    const data = {
      name,
      slug,
      typeBrand,
      categories,
      imgBrand,
      company,
    };
    const brand = await brandRepo.create(data);
    if (brand) {
      res.status(201).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const name = req.body.name;
  const slug = req.body.slug;
  const categories = req.body.categories;
  const imgBrand = req.body.icon;
  const brandId = req.body.id;
  try {
    const data = {
      name,
      slug,
      categories,
      imgBrand,
    };
    const uBrand = await brandRepo.updateB(brandId, data);
    if (uBrand) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const brandId = req.params.id;
  try {
    const checkBrandProduct = await productRepo.checkBrand(brandId);
    if (checkBrandProduct > 0) {
      return res
        .status(400)
        .send({ message: "Sản phẩm của công ty đang dùng thương hiệu này" });
    }
    const dBrand = await brandRepo.deleteB(brandId);
    if (dBrand) {
      res.status(201).send({ status: "success" });
    } else {
      res
        .status(400)
        .send({ status: "failed", messsage: "Xóa không thành công" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const uploadIcon = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "brand-icon", true);
    const fileStorage = customFileDiskStorage(
      file,
      "brand-icon",
      "Brand_" + newDateTimeString()
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
    const result = getFileLocation(req.params.name, "brand-icon");
    if (!result || result === null) {
      throw new Error(
        "Không tìm thấy ảnh " + req.params.name + " của thương hiệu."
      );
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
