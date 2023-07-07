import { createAccessToken } from "./../utils/authentication.util";
import { Request, Response } from "express";
import {
  companyGetById,
  isUniqueCompanyEmail,
  companyCreate,
  companyChangePassword,
  companyUpdate,
  companyDelete,
  companyGetHashedPasswordByEmail,
  companyGetListForMarketerRegistering,
} from "../repositories/company.repo";
import { productCategoryDeleteManyByCompany } from "../repositories/productCategory.repo";
import { productSubCategoryDeleteManyByCompany } from "../repositories/productSubCategory.repo";
import { marketerDeleteManyByCompany } from "../repositories/marketer.repo";
import {
  productVariantSampleSeedForCompany,
  productVariantSampleDeleteByCompany,
} from "../repositories/productVariantSample";
import * as companyIncomeRepo from "../repositories/companyIncome.repo";
import * as argon2 from "argon2";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";
//#region Gets
export const getById = async (req: Request, res: Response) => {
  try {
    const data = await companyGetById(req.body.user.company);
    res.status(200).json({ status: "success", data, role: "company" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListForMarketerRegistering = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await companyGetListForMarketerRegistering();
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Login & Register
export const register = async (req: Request, res: Response) => {
  try {
    const bodyCreate = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      password: await argon2.hash(req.body.password),
    };
    const isUniqueEmail = await isUniqueCompanyEmail(bodyCreate.email);
    if (isUniqueEmail === false) {
      throw new Error(
        "Địa chỉ email này đã được sử dụng bởi một doanh nghiệp khác."
      );
    }
    const result = await companyCreate(bodyCreate);
    await productVariantSampleSeedForCompany(result);
    const dataIncome = {
      company: result,
    };
    const createIncome = await companyIncomeRepo.companyIncomeCreate(
      dataIncome
    );
    if (createIncome) {
      res.status(201).json({ status: "success" });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Đã có lỗi xảy ra. Xin vui lòng thử lại sau",
      });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await companyGetHashedPasswordByEmail(
      req.body.email
    );
    if (hashedPassword === null) {
      throw new Error("Doanh nghiệp chưa đăng ký trên hệ thống");
    }
    const correctPassword = await argon2.verify(
      hashedPassword,
      req.body.password
    );
    if (correctPassword === true) {
      const accessToken = await createAccessToken("company", req.body.email);
      res.status(200).json({ data: accessToken });
    } else {
      throw new Error("Thông tin đăng nhập không chính xác");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Modifies
export const changePassword = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await companyGetHashedPasswordByEmail(
      req.body.email
    );
    const correctPassword = await argon2.verify(
      hashedPassword,
      req.body.oldPassword
    );
    if (correctPassword === true) {
      const bodyChangePassword = {
        email: req.body.email,
        password: await argon2.hash(req.body.newPassword),
      };
      const result = await companyChangePassword(bodyChangePassword);
      res.status(200).json({ data: result });
    } else {
      throw new Error("Mật khẩu cũ không chính xác.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    };
    const result = await companyUpdate(req.body._id, bodyUpdate);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Delete
export const deleteById = async (req: Request, res: Response) => {
  try {
    const company = await companyGetById(req.params.id);
    if (company === undefined) {
      throw new Error("Không tìm thấy doanh nghiệp để xóa.");
    }
    // Delete categories
    await productCategoryDeleteManyByCompany(company._id);
    // Delete sub categories
    await productSubCategoryDeleteManyByCompany(company._id);
    // Delete marketers
    if (company.marketers > 0) {
      await marketerDeleteManyByCompany(company._id);
    }
    // Delete product variant samples
    await productVariantSampleDeleteByCompany(company._id);
    // Delete company
    const result = await companyDelete(company);
    res.status(400).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Logo & favicon
export const uploadLogo = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "company-logo", true);
    const fileStorage = getFileDiskStorage(file, "company-logo");
    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;
    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);
    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const marketer: any = await companyGetById(req.body._id);
      if (!marketer || marketer === undefined) {
        throw new Error(
          "Không tìm thấy tài khoản doanh nghiệp " + req.body._id
        );
      } else {
        if (marketer.avatar) {
          // Remove old image
          const oldSrc = marketer.avatar.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          logo: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };
        const result = await companyUpdate(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getLogo = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "company-logo");
    if (!result || result === null) {
      throw new Error("Không tìm thấy logo của doanh nghiệp.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadFavicon = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "company-favicon", true);
    const fileStorage = getFileDiskStorage(file, "company-favicon");

    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;

    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const marketer: any = await companyGetById(req.body._id);
      if (!marketer || marketer === undefined) {
        throw new Error(
          "Không tìm thấy tài khoản doanh nghiệp " + req.body._id
        );
      } else {
        if (marketer.avatar) {
          // Remove old image
          const oldSrc = marketer.avatar.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          favicon: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };

        const result = await companyUpdate(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getFavicon = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "company-favicon");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh tiêu đề website của doanh nghiệp.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
