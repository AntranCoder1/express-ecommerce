import { Request, Response } from "express";
import {
  isProductSubCategorySlugAvailable,
  productSubCategoryCreate,
  ps_getRecommendSlug,
  productSubCategoryGetBySlug,
  productSubCategoryGetListByCompany,
  productSubCategoryGetListByCategory,
  productSubCategoryUpdate,
  productSubCategoryDeleteById,
  productSubCategoryModifyProductQuantity,
} from "./../repositories/productSubCategory.repo";
import {
  productGetListBySubCategory,
  productDeleteManyBySubCategory,
  productUpdateManyBySubCategory,
} from "./../repositories/product.repo";
import { uncategorizedProductCategory } from "../core/variables";
import { VietnameseStringToSlug } from "../utils/supporter.util";
//#region Gets
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const data = await productSubCategoryGetBySlug(
      req.body.slug,
      req.body.company
    );
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getRecommendSlug = async (req: Request, res: Response) => {
  try {
    const result = await ps_getRecommendSlug(req.body.name, req.body.company);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCompany = async (req: Request, res: Response) => {
  try {
    const data = await productSubCategoryGetListByCompany(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCategory = async (req: Request, res: Response) => {
  try {
    const data = await productSubCategoryGetListByCategory(req.params.id);
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
      category: req.body.category ? req.body.category : null,
      name: req.body.name,
      slug: req.body.slug,
    };
    bodyCreate.slug = VietnameseStringToSlug(bodyCreate.slug);
    const isSlugAvailable = await isProductSubCategorySlugAvailable(
      bodyCreate.slug,
      bodyCreate.company
    );
    if (isSlugAvailable === true) {
      const result = await productSubCategoryCreate(bodyCreate);
      res.status(201).json({ data: result });
    } else {
      throw new Error(
        "Đường dẫn slug của danh mục phụ đã được sử dụng bởi một danh mục khác."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      name: req.body.name,
      slug: req.body.slug,
      category: req.body.category,
      company: req.body.company,
    };
    const isSlugAvailable = await isProductSubCategorySlugAvailable(
      bodyUpdate.slug,
      bodyUpdate.company,
      req.body._id
    );
    if (isSlugAvailable === true) {
      const result = await productSubCategoryUpdate(req.body._id, bodyUpdate);
      res.status(200).json({ data: result });
    } else {
      throw new Error(
        "Đường dẫn slug của danh mục phụ đã được sử dụng bởi một danh mục khác."
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
    const result = await productSubCategoryDeleteById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteAndHandleProducts = async (req: Request, res: Response) => {
  try {
    const handleType = req.body.handleType;
    const subCategoryId = req.body._id;
    const subCategoryCompany = req.body.company;
    const newSubCategoryId = req.body.newSubCategory;
    const category = req.body.category;
    //#region Handle products
    switch (handleType) {
      case "delete-all": {
        await productDeleteManyBySubCategory(subCategoryId);
        break;
      }
      case "move-to-uncategorized": {
        let uncategoryId: any;
        const uncategorized = await productSubCategoryGetBySlug(
          "uncategorized",
          subCategoryCompany
        );
        if (uncategorized === undefined) {
          const bodyCreate = {
            name: uncategorizedProductCategory.name,
            slug: uncategorizedProductCategory.slug,
            company: subCategoryCompany,
            category,
          };
          uncategoryId = await productSubCategoryCreate(bodyCreate);
        } else {
          uncategoryId = uncategorized._id;
        }
        const products = await productGetListBySubCategory(subCategoryId);
        await productUpdateManyBySubCategory(subCategoryId, uncategoryId);
        await productSubCategoryModifyProductQuantity(
          uncategoryId,
          products.length
        );
        break;
      }
      case "move-to-category": {
        const products = await productGetListBySubCategory(subCategoryId);
        await productUpdateManyBySubCategory(subCategoryId, newSubCategoryId);
        await productSubCategoryModifyProductQuantity(
          newSubCategoryId,
          products.length
        );
        break;
      }
    }
    //#endregion
    const result = await productSubCategoryDeleteById(subCategoryId);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
