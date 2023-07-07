import { Request, Response } from "express";
import * as customerWithdrawRepo from "../repositories/customerWithdraw.repo";
import * as customerTokenRepo from "../repositories/customerToken.repo";
import * as customerTokenTransactionRepo from "../repositories/customerTokenTransaction.repo";
import * as customerTransactionRepo from "../repositories/customerTransactionLog.repo";
import * as H2ExpressWithdrawTokenRepo from "../repositories/H2ExpressWithdrawToken.repo";
import * as H2ExpressTransactionRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as H2ExpressTransactionTokenRepo from "../repositories/h2ExpressTokenTransaction.repo";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";

export const updateProcessing = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    const description = req.body.description;
    const customer = req.body.customer;
    const token = req.body.token;
    const money = req.body.money;

    // create withdraw token h2
    const dataWithdraw = {
      user: customer,
      type: "withdraw",
      transferMethod: "token",
      transactionCode: "",
      status,
      description:
        status === 2
          ? "Bạn đã chấp nhập yêu cầu cho user " + customer + " rút " + token
          : status === 4
          ? "từ chối"
          : status === 3
          ? "Xử lỹ lỗi"
          : "",
      token,
    };

    const createWithdrawToken =
      await H2ExpressWithdrawTokenRepo.createWithdrawToken(dataWithdraw);

    // create transaction history h2Express
    const dataTransactioH2 = {
      type: "withdraw",
      transferMethod: "token",
      transactionCode: "",
      description:
        status === 2
          ? "Bạn đã cho phép user " + customer + " rút " + token + " token"
          : status === 4
          ? "từ chối"
          : status === 3
          ? "Xử lỹ lỗi"
          : "",
      token,
    };

    const createTransactionH2 =
      await H2ExpressTransactionRepo.createTransaction(dataTransactioH2);

    if (status === 2) {
      const findTokenCustomer = await customerTokenRepo.findHistoryToken(
        customer
      );

      console.log("findTokenCustomer", findTokenCustomer);

      const lastToken = findTokenCustomer[0].token - token;

      console.log("lastToken", lastToken);

      // update token collab
      const updateTokenCollab =
        await customerTokenRepo.updateTokenWithCustomerId(customer, {
          token: lastToken,
        });

      // update request
      const updateDesc = await customerWithdrawRepo.update(id, {
        description: "Đã xử lý",
      });

      // createTransaction token
      const dataTransactionToken = {
        type: "withdraw",
        token,
        lastBalanceToken: lastToken,
        description: "Bạn đã rút thành công " + token + " token",
      };

      const createTransactionToken =
        await customerTokenTransactionRepo.createTransaction(
          dataTransactionToken
        );

      // create transaction history log
      const dataTransactionLog = {
        customer,
        type: "withdraw",
        transferMethod: "token",
        description:
          "bạn đã rút thành công " +
          token +
          " token. Số dư token hiện tại của bạn là: " +
          lastToken,
        transactionCode: "",
        token,
      };
      const createTransactionLog =
        await customerTransactionRepo.createTransactionLog(dataTransactionLog);

      // create transaction token h2Express
      const dataTransactionTokenH2 = {
        type: "withdraw",
        token,
        description:
          "Bạn đã cho phép user " + customer + " rút " + token + " token",
      };

      const createTransactionTokenH2 =
        await H2ExpressTransactionTokenRepo.createTransaction(
          dataTransactionTokenH2
        );
    } else {
      // update request
      const updateDesc = await customerWithdrawRepo.update(id, {
        description,
      });
    }

    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getByAdmin = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const method = req.body.method;
    const status = Number(req.body.status);
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);

    const withdrawHistory = await customerWithdrawRepo.getAll(
      name,
      method,
      status,
      startDate,
      finishDate,
      offset,
      page
    );

    const total = await customerWithdrawRepo.countList({
      name,
      method,
      status,
      startDate,
      finishDate,
    });

    if (withdrawHistory) {
      res.status(200).send({ status: "success", data: withdrawHistory, total });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const detail = await customerWithdrawRepo.getById(id);
    if (detail) {
      res.status(200).send({ status: "success", data: detail });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateWithdraw = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const customer = req.body.customer;
    const status = req.body.status;
    const token = Number(req.body.token);
    const description = req.body.description;
    const transferMethod = req.body.transferMethod;
    const transactionCode = req.body.transactionCode;

    const file: any = req.file;

    const tempStorage = getFileDiskStorage(
      file,
      "customer-withdraw-history",
      true
    );
    const fileStorage = getFileDiskStorage(file, "customer-withdraw-history");
    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;
    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const withdraw = await customerWithdrawRepo.getById(id);
      if (!withdraw || withdraw === undefined) {
        throw new Error(
          "Không tìm thấy yêu cầu rút từ khách hàng" + req.params.id
        );
      } else {
        if (withdraw.image) {
          // Remove old image
          const oldSrc = withdraw.image.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const name = fileStorage.filename;
        const data = {
          image: {
            path: newDest,
            name,
            type: file.mimetype,
          },
          status,
          description,
          transactionCode,
        };
        const updateWithdrawHistory = await customerWithdrawRepo.update(
          id,
          data
        );
      }
    }
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(
      req.params.name,
      "customer-withdraw-history"
    );
    if (!result || result === null) {
      throw new Error("Không tìm thấy hình ảnh của lịch sử rút.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
