import { createAccessToken } from "./../utils/authentication.util";
import { Request, Response } from "express";
import {
  marketerGetById,
  marketerGetListByCompany,
  isUniqueMarketerEmail,
  marketerCreate,
  marketerChangePassword,
  marketerUpdate,
  marketerDelete,
  marketerGetHashedPasswordByEmail,
} from "../repositories/marketer.repo";
import * as domainRepo from "../repositories/domain.repo";
import * as marketerRepo from "../repositories/marketer.repo";
import * as customerReviewRepo from "../repositories/review.repo";
import { companyModifyMarketerQuantity } from "../repositories/company.repo";
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
  const marketer = req.body.user._id;
  try {
    const data = await marketerGetById(marketer);
    res.status(200).json({ status: "success", data, role: "marketer" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByCompany = async (req: Request, res: Response) => {
  try {
    const data = await marketerGetListByCompany(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Login & register
export const register = async (req: Request, res: Response) => {
  try {
    const emailReferrer = req.body.referrers;
    let referrers;
    if (emailReferrer) {
      const marketer = await marketerRepo.findByEmail(emailReferrer);
      if (marketer) {
        referrers = marketer._id;
      } else {
        throw new Error("Địa chỉ email này không tồn tại.");
      }
    } else {
      referrers = null;
    }
    const bodyCreate = {
      company: req.body.company,
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: await argon2.hash(req.body.password),
      referrers,
    };
    const isUniqueEmail = await isUniqueMarketerEmail(bodyCreate.email);
    if (isUniqueEmail === false) {
      throw new Error(
        "Địa chỉ email này đã được sử dụng bởi một người tiếp thị khác."
      );
    }
    const data = await marketerCreate(bodyCreate);
    // Increase marketers quantity of company
    await companyModifyMarketerQuantity(bodyCreate.company, 1);
    res.status(201).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await marketerGetHashedPasswordByEmail(
      req.body.email
    );
    if (!hashedPassword || hashedPassword === null) {
      throw new Error("Email không tồn tại trong hệ thống.");
    }
    const correctPassword = await argon2.verify(
      hashedPassword,
      req.body.password
    );
    if (correctPassword) {
      const accessToken = await createAccessToken("marketer", req.body.email);
      res.status(200).json({ data: accessToken });
    } else {
      throw new Error("Thông tin đăng nhập không chính xác.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Modifies
export const changePassword = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await marketerGetHashedPasswordByEmail(
      req.body.email
    );
    const correctPassword = await argon2.verify(
      hashedPassword,
      req.body.oldPassword
    );
    if (correctPassword) {
      const bodyChangePassword = {
        email: req.body.email,
        password: await argon2.hash(req.body.newPassword),
      };
      const result = await marketerChangePassword(bodyChangePassword);
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
    };
    const result = await marketerUpdate(req.body._id, bodyUpdate);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Delete
export const deleteById = async (req: Request, res: Response) => {
  try {
    const marketer = await marketerGetById(req.params.id);
    if (marketer === undefined) {
      throw new Error("Không tìm thấy người tiếp thị để xóa.");
    }
    // Decrease marketers quantity of company
    await companyModifyMarketerQuantity(marketer.company._id, -1);
    // Delete marketer
    const result = await marketerDelete(marketer);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "marketer-avatar", true);
    const fileStorage = getFileDiskStorage(file, "marketer-avatar");

    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;

    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const marketer = await marketerGetById(req.body._id);
      if (!marketer || marketer === undefined) {
        throw new Error(
          "Không tìm thấy tài khoản người tiếp thị " + req.body._id
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
          avatar: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };

        const result = await marketerUpdate(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getAvatar = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "marketer-avatar");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh đại diện của người tiếp thị.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion

// review
export const reviewProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;

    const findAll = await customerReviewRepo.findAll({ productId });

    if (findAll) {
      res.status(200).send({ status: "success", data: findAll });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
