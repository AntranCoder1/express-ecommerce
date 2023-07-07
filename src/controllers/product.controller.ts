import { Request, Response } from "express";
import {
  productGetById,
  isProductSlugAvailable,
  productGetBySlug,
  productGetListByCategory,
  productGetListBySubCategory,
  productGetListByCompany,
  productGetRecommendSlug,
  productCreate,
  productUpdate,
  productDelete,
  productDeleteImages,
  searchProductCompany,
  deleteProduct,
} from "./../repositories/product.repo";
import { uncategorizedProductCategory } from "./../core/variables";
import {
  productCategoryModifyProductQuantity,
  productCategoryCreate,
  productCategoryGetBySlug,
} from "./../repositories/productCategory.repo";
import { productSubCategoryModifyProductQuantity } from "./../repositories/productSubCategory.repo";
import {
  dp_updateCompanyPrice,
  dp_updateProduct,
} from "./../repositories/domainProduct.repo";
import * as listFeeRepo from "../repositories/listFee.repo";
import * as companyTransferRepo from "../repositories/companyTransfer.repo";
import * as companyIncomeRepo from "../repositories/companyIncome.repo";
import * as companyTransactionLogRepo from "../repositories/companyTransactionLog.repo";
import * as listFeeTransactionLogRepo from "../repositories/listFeeTransactionLog.repo";
import * as companyTokenRepo from "../repositories/companyToken.repo";
import * as companyTokenTransactionRepo from "../repositories/companyTokenTransaction.repo";
import { VietnameseStringToSlug } from "../utils/supporter.util";
import * as reviewRepo from "../repositories/review.repo";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
  customFileDiskStorage,
  newDateTimeString,
} from "../utils/upload.util";
import path from "path";
import fs, { rmSync } from "fs";
//#region Gets
export const getById = async (req: Request, res: Response) => {
  try {
    const data = await productGetById(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getBySlug = async (req: Request, res: Response) => {
  const slug = req.body.slug;
  const company = req.body.user.company;

  try {
    const data = {
      slug,
      company,
    };
    const getProduct = await productGetBySlug(data);
    res.status(200).json({ data: getProduct });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCategory = async (req: Request, res: Response) => {
  try {
    const data = await productGetListByCategory(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListBySubCategory = async (req: Request, res: Response) => {
  try {
    const data = await productGetListBySubCategory(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCompany = async (req: Request, res: Response) => {
  const companyId = req.body.user.company;
  try {
    const data = await productGetListByCompany(companyId);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  const companyId = req.body.user.company;
  const text = req.body.text;
  const categoryId = req.body.categoryId;
  const subCategoryId = req.body.subCategoryId;
  const orderByPrice = req.body.orderByPrice;
  const orderbyDate = req.body.orderbyDate;
  try {
    const data = await searchProductCompany(
      companyId,
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

export const getRecommendSlug = async (req: Request, res: Response) => {
  try {
    const data = req.body.product
      ? await productGetRecommendSlug(
          req.body.user.company,
          req.body.slug,
          req.body.product
        )
      : await productGetRecommendSlug(req.body.user.company, req.body.slug);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

const formatCurrency = (money) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money);
};

//#endregion
//#region Modifies
export const create = async (req: Request, res: Response) => {
  try {
    const bodyCreate = {
      name: req.body.name,
      importPrice: req.body.importPrice,
      price: req.body.price,
      inStock: req.body.inStock,
      description: req.body.description,
      isAllowedChangePrice: req.body.isAllowedChangePrice,
      technicalInfos: req.body.technicalInfos,
      category: req.body.category ? req.body.category : null,
      subCategory: req.body.subCategory ? req.body.subCategory : null,
      company: req.body.user._id,
      brand: req.body.brand ? req.body.brand : null,
      slug: req.body.slug,
      location: req.body.location,
      isDiscount: req.body.isDiscount,
      discount: req.body.discount,
    };
    //#region Handle slug
    bodyCreate.slug = VietnameseStringToSlug(bodyCreate.slug);
    const isSlugAvailable: any = await isProductSlugAvailable(
      bodyCreate.company,
      bodyCreate.slug
    );
    if (isSlugAvailable === false) {
      throw new Error("Đường dẫn slug đã được dùng bởi sản phẩm khác.");
    }
    //#endregion
    //#region Handle Category & Sub-Category
    // Category
    if (!bodyCreate.category) {
      const category = await productCategoryGetBySlug(
        uncategorizedProductCategory.slug,
        bodyCreate.company
      );
      let categoryId: any = category?._id.toString();
      if (categoryId === undefined || !categoryId) {
        categoryId = await productCategoryCreate({
          name: uncategorizedProductCategory.name,
          slug: uncategorizedProductCategory.slug,
          company: bodyCreate.company,
        });
      }
      bodyCreate.category = categoryId;
    }
    await productCategoryModifyProductQuantity(bodyCreate.category, 1);
    //#endregion
    const newProductId = await productCreate(bodyCreate);
    // Sub Category
    if (bodyCreate.subCategory) {
      await productSubCategoryModifyProductQuantity(bodyCreate.subCategory, 1);
    }
    // list Fee
    const company = req.body.user._id;
    const amount = req.body.amount;

    if (amount) {
      const companyIncome = await companyTokenRepo.getTokenWithCompany(company);
      if (companyIncome.token < amount) {
        throw new Error(
          "Số dư không đủ. Vui lòng nạp thêm để thực hiện giao dịch"
        );
      }
      const transferData = {
        company,
        type: "listFee",
        productId: newProductId._id,
        transferMethod: "system",
        lastBalance: companyIncome.token - amount,
        token: amount,
        status: 1,
        description: "Giao dịch thành công",
      };
      const createTransfer = await listFeeRepo.listFeeCreate(transferData);

      // create transaction history
      const transactionData = {
        company,
        CompanyListFee: createTransfer._id,
        type: "transfer",
        lastBalance: companyIncome.token - amount,
        token: "-" + amount,
        transferMethod: "system",
        description:
          "Bạn đã trả " +
          amount +
          " token để list sản phẩm " +
          newProductId._id +
          " lên hệ thống ",
        transactionCode: "",
      };
      const createTransaction =
        await listFeeTransactionLogRepo.listFeeTransactionLogCreate(
          transactionData
        );
      // update company token
      const lastToken = companyIncome.token - amount;

      const updateTokenCompany = await companyTokenRepo.editToken(
        company,
        lastToken
      );
      // create transaction history log token company
      const dataRecord = {
        company,
        type: "listFee",
        token: amount,
        lastBalanceToken: lastToken,
        description:
          " Bạn đã sử dụng " +
          amount +
          " token để tạo product " +
          newProductId._id +
          " số token còn lại là " +
          lastToken,
      };
      const createRecord = await companyTokenTransactionRepo.createTransaction(
        dataRecord
      );

      // create transaction history log company
      const dataTransactionCompanyLog = {
        company,
        type: "listFee",
        lastBalance: lastToken,
        transferMethod: "token",
        description:
          " Bạn đã sử dụng " +
          amount +
          " token để tạo product " +
          newProductId._id +
          " số token còn lại là " +
          lastToken,
        transactionCode: "",
        token: amount,
      };
      const createTransactionHistory =
        await companyTransactionLogRepo.createCompanyTransactionLog(
          dataTransactionCompanyLog
        );
      if (createTransaction) {
        res.status(201).json({ data: newProductId });
      } else {
        const removeProduct = await deleteProduct(newProductId._id);
        res.status(400).json({ message: "Thanh toán không thành công" });
      }
    } else {
      const removeProduct = await deleteProduct(newProductId._id);
      res.status(400).json({ message: "Thanh toán không thành công" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      name: req.body.name,
      inStock: req.body.inStock,
      importPrice: req.body.importPrice,
      price: req.body.price,
      description: req.body.description,
      isAllowedChangePrice: req.body.isAllowedChangePrice,
      technicalInfos: req.body.technicalInfos,
      category: req.body.category ? req.body.category : null,
      subCategory: req.body.subCategory ? req.body.subCategory : null,
      slug: req.body.slug,
      company: req.body.user._id,
      brand: req.body.brand ? req.body.brand : null,
      location: req.body.location,
      isDiscount: req.body.isDiscount,
      discount: req.body.discount,
    };
    const oldProduct = await productGetById(req.body._id);
    //#region Handle Slug
    bodyUpdate.slug = VietnameseStringToSlug(bodyUpdate.slug);
    const isSlugAvailable: any = await isProductSlugAvailable(
      bodyUpdate.company,
      bodyUpdate.slug
    );
    if (isSlugAvailable && req.body._id !== isSlugAvailable._id.valueOf()) {
      throw new Error("Đường dẫn đã được dùng bởi sản phẩm khác.");
    }
    //#endregion
    //#region Handle Category & Sub-category
    if (
      bodyUpdate.category &&
      oldProduct.category._id &&
      bodyUpdate.category !== oldProduct.category._id
    ) {
      await productCategoryModifyProductQuantity(bodyUpdate.category, 1);
      await productCategoryModifyProductQuantity(oldProduct.category._id, -1);
    }

    if (bodyUpdate.subCategory && !oldProduct.subCategory) {
      await productSubCategoryModifyProductQuantity(bodyUpdate.subCategory, 1);
    } else if (!bodyUpdate.subCategory && oldProduct.subCategory) {
      await productSubCategoryModifyProductQuantity(
        oldProduct.subCategory._id,
        -1
      );
    } else if (
      bodyUpdate.subCategory &&
      oldProduct.subCategory &&
      bodyUpdate.subCategory !== oldProduct.subCategory._id
    ) {
      await productSubCategoryModifyProductQuantity(bodyUpdate.subCategory, 1);
      await productSubCategoryModifyProductQuantity(
        oldProduct.subCategory._id,
        -1
      );
    }
    //#endregion
    //#region Update domain products company price if changed
    if (bodyUpdate.price !== oldProduct.price) {
      await dp_updateCompanyPrice(oldProduct._id, bodyUpdate.price);

      // let data = {
      //   name: bodyUpdate.name,
      //   slug: bodyUpdate.slug,
      // };

      await dp_updateProduct(oldProduct._id, bodyUpdate);
    }
    // await dp_updateProduct(oldProduct._id,data);

    //#endregion
    const result = await productUpdate(req.body._id, bodyUpdate);

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Deletes
export const deleteById = async (req: Request, res: Response) => {
  try {
    const product = await productGetById(req.params.id);
    if (product === undefined) {
      throw new Error("Không tìm thấy sản phẩm để xóa.");
    }
    // Decrease product quantity of product category
    if (product.category) {
      await productCategoryModifyProductQuantity(product.category._id, -1);
    }
    // Decrease product quantity of product sub category
    if (product.subCategory) {
      await productSubCategoryModifyProductQuantity(
        product.subCategory._id,
        -1
      );
    }
    const result = await productDelete(product);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteMany = async (req: Request, res: Response) => {
  try {
    const failed: string[] = [];
    const deleted: string[] = [];
    for (const id of req.body.products) {
      const product = await productGetById(id);
      if (product === undefined) {
        failed.push(id);
      } else {
        // Decrease product quantity of product category
        if (product.category) {
          await productCategoryModifyProductQuantity(product.category._id, -1);
        }
        // Decrease product quantity of product sub category
        if (product.subCategory) {
          await productSubCategoryModifyProductQuantity(
            product.subCategory._id,
            -1
          );
        }
        await productDelete(product);
        deleted.push(id);
      }
    }
    res.status(200).json({ data: { deleted, failed } });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Images
export const uploadImages = async (req: Request, res: Response) => {
  try {
    const product = await productGetById(req.body._id);
    if (product === undefined) {
      throw new Error("Không tìm thấy sản phẩm để tải ảnh lên.");
    }
    const images: any = product.images ? product.images : [];
    const files: any = req.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempStorage = getFileDiskStorage(
        file,
        "company-product-image",
        true
      );
      let tempSrc: any = tempStorage.dest;
      const fileStorage = customFileDiskStorage(
        file,
        "company-product-image",
        "CompanyProduct_" + newDateTimeString() + "_" + i.toString()
      );
      let newDest: any = fileStorage.dest;
      tempSrc = path.join(tempSrc, tempStorage.filename);
      newDest = path.join(newDest, fileStorage.filename);
      if (isAllowedFile(file) === false) {
        fs.unlinkSync(tempSrc);
        throw new Error("File tải lên không hợp lệ.");
      } else {
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        images.push({
          path: newDest,
          name: fileStorage.filename,
          type: file.mimetype,
        });
      }
    }

    const result = await productUpdate(product._id, { images });

    res.status(200).json({ data: "Tải lên ảnh sản phẩm thành công." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getImage = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "company-product-image");
    if (!result || result === null) {
      throw new Error(
        "Không tìm thấy ảnh " + req.params.name + " của sản phẩm."
      );
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteImages = async (req: Request, res: Response) => {
  try {
    await productDeleteImages(req.body.images);
    res.status(200).json({ data: "Xóa ảnh sản phẩm thành công." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
export const updatePositionImage = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const images = req.body.images;
    const result = await productUpdate(id, { images });
    if (result) {
      res.status(200).json({ data: "Cập nhật ảnh sản phẩm thành công." });
    } else {
      res.status(400).json({ message: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// review product
export const getReviewProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    // const maketerId = req.body.maketerId;

    const findReview = await reviewRepo.findAll({ productId });

    if (findReview) {
      res.status(200).send({ status: "success", data: findReview });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
