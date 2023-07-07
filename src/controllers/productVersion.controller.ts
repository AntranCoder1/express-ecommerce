import { Request, Response } from "express";
import {
  productVersionGetById,
  productVersionGetListByProduct,
  productVersionCreate,
  productVersionUpdate,
  productVersionDeleteById,
  productVersionDeleteImages,
  productVersionDeleteMany,
} from "./../repositories/productVersion.repo";
import * as domainProductRepo from "../repositories/domainProduct.repo";
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
//#region Gets
export const getById = async (req: Request, res: Response) => {
  try {
    const data = await productVersionGetById(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByProduct = async (req: Request, res: Response) => {
  try {
    const data = await productVersionGetListByProduct(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Modifies
export const create = async (req: Request, res: Response) => {
  try {
    const bodyCreate = {
      product: req.body.product,
      name: req.body.name,
      price: req.body.price,
      attributes: req.body.attributes,
      inStock: req.body.inStock,
    };
    const result = await productVersionCreate(bodyCreate);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      name: req.body.name,
      price: req.body.price,
      inStock: req.body.inStock,
      attributes: req.body.attributes,
    };
    const result = await productVersionUpdate(req.body._id, bodyUpdate);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Deletes
export const deleteById = async (req: Request, res: Response) => {
  console.log(req.params.id);

  try {
    const result = await productVersionDeleteById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteMany = async (req: Request, res: Response) => {
  try {
    await productVersionDeleteMany(req.body.versions);
    res.status(200).json({ data: "Các phiên bản của sản phẩm đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Image
export const uploadImage = async (req: Request, res: Response) => {
  try {
    console.log("-file", req.file);

    const file: any = req.file;
    const tempStorage = getFileDiskStorage(
      file,
      "company-product-version",
      true
    );
    const fileStorage = customFileDiskStorage(
      file,
      "company-product-version",
      "CompanyProductVersion_" + newDateTimeString()
    );

    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;

    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const productVersion = await productVersionGetById(req.body._id);
      if (!productVersion || productVersion === undefined) {
        throw new Error("Không tìm thấy phiên bản sản phẩm " + req.body._id);
      } else {
        if (productVersion.image) {
          // Remove old image
          const oldSrc = productVersion.image.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          image: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };
        const result = await productVersionUpdate(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getImage = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "company-product-version");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh của phiên bản sản phẩm.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteImages = async (req: Request, res: Response) => {
  try {
    await productVersionDeleteImages(req.body.images);
    res
      .status(200)
      .json({ message: "Đã xóa hình ảnh các phiên bản sản phẩm." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
