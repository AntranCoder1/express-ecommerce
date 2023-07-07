import { Request, Response } from "express";
import {
  isProductCategorySlugAvailable,
  productCategoryCreate,
  pc_getRecommendSlug,
  productCategoryGetBySlug,
  productCategoryGetListByCompany,
  productCategoryUpdate,
  productCategoryDeleteById,
  productCategoryModifyProductQuantity,
} from "./../repositories/productCategory.repo";
import {
  productSubCategoryDeleteManyByCategory,
  productSubCategoryUpdateManyByCategory,
} from "./../repositories/productSubCategory.repo";
import {
  productGetListByCategory,
  productUpdate,
  productUpdateManyByCategory,
  productDeleteManyByCategory,
} from "./../repositories/product.repo";
import { VietnameseStringToSlug } from "../utils/supporter.util";
import { uncategorizedProductCategory } from "../core/variables";
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
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const data = await productCategoryGetBySlug(
      req.body.slug,
      req.body.user._id
    );
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getRecommendSlug = async (req: Request, res: Response) => {
  const name = req.body.name;
  const company = req.body.user._id;
  try {
    const result = await pc_getRecommendSlug(name, company);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCompany = async (req: Request, res: Response) => {
  const company = req.body.user.company;
  try {
    const data = await productCategoryGetListByCompany(company);
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
      company: req.body.user._id,
      icon: req.body.icon,
      name: req.body.name,
      slug: req.body.slug,
    };
    bodyCreate.slug = VietnameseStringToSlug(bodyCreate.slug);
    const isSlugAvailable = await isProductCategorySlugAvailable(
      bodyCreate.slug,
      bodyCreate.company
    );
    if (isSlugAvailable === true) {
      const result = await productCategoryCreate(bodyCreate);
      res.status(201).json({ data: result });
    } else {
      throw new Error(
        "Đường dẫn slug của danh mục đã được sử dụng bởi một danh mục khác."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const uploadIcon = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "company-product-icon", true);
    const fileStorage = customFileDiskStorage(
      file,
      "company-product-icon",
      "CompanyProductIcon_" + newDateTimeString()
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
    const result = getFileLocation(req.params.name, "company-product-icon");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh của phiên bản sản phẩm.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      icon: req.body.icon,
      name: req.body.name,
      slug: req.body.slug,
      company: req.body.user._id,
    };
    bodyUpdate.slug = VietnameseStringToSlug(bodyUpdate.slug);
    const isSlugAvailable = await isProductCategorySlugAvailable(
      bodyUpdate.slug,
      bodyUpdate.company,
      req.body._id
    );
    if (isSlugAvailable === true) {
      const result = await productCategoryUpdate(req.body._id, bodyUpdate);
      res.status(200).json({ data: result });
    } else {
      throw new Error(
        "Đường dẫn slug của danh mục đã được sử dụng bởi một danh mục khác."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Deletes
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await productCategoryDeleteById(req.params.id);
    if (result) {
      await productSubCategoryDeleteManyByCategory(req.params.id);
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
// ------------------------------------------------------------------
// Incase of delete categories with products quantity more than zero.
// Will be three options on the CMS interface:
// 1. 'delete-all': Delete category and all of the products.
// 2. 'move-to-uncategorized': Delete category and update all products to the 'Uncategorized' category.
// 3. 'move-to-category': Delete category and update all products to a specific category.
/* The request body: {
    _id: The id of category,
    handleType: The type of action,
    company: The id of company which category belong to,
    newCategory: The id of category which products will be transfer to
}*/
export const deleteAndHandleProducts = async (req: Request, res: Response) => {
  try {
    const handleType = req.body.handleType;
    const categoryId = req.body._id;
    const categoryCompany = req.body.user._id;
    const newCategoryId = req.body.newCategory;
    //#region Handle products
    switch (handleType) {
      case "delete-all": {
        await productDeleteManyByCategory(categoryId);
        await productSubCategoryDeleteManyByCategory(categoryId);
        break;
      }
      case "move-to-uncategorized": {
        let uncategoryId: any;
        const uncategorized = await productCategoryGetBySlug(
          uncategorizedProductCategory.slug,
          categoryCompany
        );
        if (uncategorized === undefined) {
          const bodyCreate = uncategorizedProductCategory;
          bodyCreate.company = categoryCompany;
          uncategoryId = await productCategoryCreate(bodyCreate);
        } else {
          uncategoryId = uncategorized._id;
        }
        const products = await productGetListByCategory(categoryId);
        await productUpdateManyByCategory(categoryId, uncategoryId);
        await productSubCategoryUpdateManyByCategory(categoryId, uncategoryId);
        await productCategoryModifyProductQuantity(
          uncategoryId,
          products.length
        );
        break;
      }
      case "move-to-category": {
        const products = await productGetListByCategory(categoryId);
        await productUpdateManyByCategory(categoryId, newCategoryId);
        await productSubCategoryUpdateManyByCategory(categoryId, newCategoryId);
        await productCategoryModifyProductQuantity(
          newCategoryId,
          products.length
        );
        break;
      }
    }
    //#endregion
    const result = await productCategoryDeleteById(categoryId);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
