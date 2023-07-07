import { Request, Response } from "express";
import * as marketerWithdrawHistoryRepo from "../repositories/marketerWithdrawHistory.repo";
import * as marketerIncomeRepo from "../repositories/marketerIncome.repo";
import * as marketerTransactionLogRepo from "../repositories/marketerTransactionLog.repo";
import * as H2ExpressWithdrawTokenRepo from "../repositories/H2ExpressWithdrawToken.repo";
import * as H2ExpressTransactionRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as H2ExpressTransactionTokenRepo from "../repositories/h2ExpressTokenTransaction.repo";
import * as markerterTokenRepo from "../repositories/markerterToken.repo";
import * as markerterTokenTransactionRepo from "../repositories/markerterTokenTransaction.repo";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";
export const createRequestByMarketer = async (req: Request, res: Response) => {
  try {
    const marketer = req.body.user._id;
    const transferMethod = req.body.transferMethod;
    const money: number = req.body.money;
    const marketerIncome = await marketerIncomeRepo.getByMarketer(marketer);
    if (money < 50000) {
      throw new Error("Số tiền tối thiểu là 50.000đ. Vui lòng nhập lại");
    }
    if (money > marketerIncome.accountBalance) {
      throw new Error("Số dư không đủ để thực hiện giao dịch");
    }
    const data = {
      marketer,
      transferMethod,
      money,
      description: "Yêu cầu rút",
    };
    const createRequest =
      await marketerWithdrawHistoryRepo.createMarketerWithdrawHistory(data);
    const dataIncome = {
      accountBalance: marketerIncome.accountBalance - money,
    };
    const deductMoneyMarketer =
      await marketerIncomeRepo.updateMarketerIncomeByMarketer(
        marketer,
        dataIncome
      );

    if (createRequest) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({
        status: "failed",
        message: "Đã có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ Admin",
      });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateProcessing = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    const description = req.body.description;
    const marketer = req.body.marketer;
    const money = req.body.money;
    const token = req.body.token;

    const data = {
      status,
      description,
    };

    if (money > 0) {
      const updateStatus = await marketerWithdrawHistoryRepo.update(id, data);
      if (status === 4) {
        const marketerIncome = await marketerIncomeRepo.getByMarketer(marketer);
        const accountBalance: number = marketerIncome.accountBalance + money;
        const dataIncome = {
          accountBalance,
        };
        const updateMarketerIncome =
          await marketerIncomeRepo.updateMarketerIncomeByMarketer(
            marketer,
            dataIncome
          );
      }

      if (updateStatus) {
        res.status(200).send({ status: "success" });
      } else {
        res.status(400).send({
          status: "failed",
          message: "Đã có lỗi xảy ra vui lòng thử lại sau hoặc liên hệ Admin",
        });
      }
    }

    if (token > 0) {
      // create withdraw token h2
      const dataWithdraw = {
        user: marketer,
        type: "withdraw",
        transferMethod: "token",
        transactionCode: "",
        status,
        description:
          status === 2
            ? "Bạn đã chấp nhập yêu cầu cho user " + marketer + " rút " + token
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
            ? "Bạn đã cho phép user " + marketer + " rút " + token + " token"
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
        const findTokenCollab = await markerterTokenRepo.findDepositHistory(
          marketer
        );

        console.log("findTokenCollab", findTokenCollab);

        const lastToken = findTokenCollab[0].token - token;

        console.log("lastToken", lastToken);

        // update token collab
        const updateTokenCollab = await markerterTokenRepo.updateToken(
          marketer,
          findTokenCollab[0].company,
          { token: lastToken }
        );

        // update request
        const updateDesc = await marketerWithdrawHistoryRepo.update(id, {
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
          await markerterTokenTransactionRepo.createTransaction(
            dataTransactionToken
          );

        // create transaction history log
        const dataTransactionLog = {
          marketer,
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
          await marketerTransactionLogRepo.createMarketerTransactionLog(
            dataTransactionLog
          );

        // create transaction token h2Express
        const dataTransactionTokenH2 = {
          type: "withdraw",
          token,
          description:
            "Bạn đã cho phép user " + marketer + " rút " + token + " token",
        };

        const createTransactionTokenH2 =
          await H2ExpressTransactionTokenRepo.createTransaction(
            dataTransactionTokenH2
          );
      } else {
        // update request
        const updateDesc = await marketerWithdrawHistoryRepo.update(id, {
          description,
        });
      }
      res.status(200).send({ status: "success" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateWithdraw = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const marketer = req.body.marketer;
    const status = req.body.status;
    const money = Number(req.body.money);
    const description = req.body.description;
    const transferMethod = req.body.transferMethod;
    const transactionCode = req.body.transactionCode;
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(
      file,
      "marketer-withdraw-history",
      true
    );
    const fileStorage = getFileDiskStorage(file, "marketer-withdraw-history");
    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;
    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);
    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const withdraw = await marketerWithdrawHistoryRepo.getById(id);
      if (!withdraw || withdraw === undefined) {
        throw new Error(
          "Không tìm thấy yêu cầu rút từ cộng tác viên" + req.params.id
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
        const updateWithdrawHistory = await marketerWithdrawHistoryRepo.update(
          id,
          data
        );
        if (status === "2") {
          const marketerIncome = await marketerIncomeRepo.getByMarketer(
            marketer
          );
          const dataIncome = {
            withdraw: marketerIncome.withdraw + money,
          };
          const updateMarketerIncome =
            await marketerIncomeRepo.updateMarketerIncomeByMarketer(
              marketer,
              dataIncome
            );
          const dataLog = {
            marketer,
            type: "withdraw",
            idType: id,
            money: "-" + money,
            description: "Bạn đã rút " + money + " đ",
            transferMethod,
            transactionCode,
          };
          const createTransactionLog =
            await marketerTransactionLogRepo.createMarketerTransactionLog(
              dataLog
            );
        } else if (status === "3") {
          const marketerIncome = await marketerIncomeRepo.getByMarketer(
            marketer
          );
          const accountBalance: number = marketerIncome.accountBalance + money;
          const dataIncome = {
            accountBalance,
          };
          const updateMarketerIncome =
            await marketerIncomeRepo.updateMarketerIncomeByMarketer(
              marketer,
              dataIncome
            );
        }

        if (updateWithdrawHistory) {
          res.status(200).send({ status: "success" });
        } else {
          res.status(400).send({ status: "failed" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getByMarketer = async (req: Request, res: Response) => {
  try {
    const id = req.body.user._id;
    const method = req.body.method;
    const status = Number(req.body.status);
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const marketerWDHis = await marketerWithdrawHistoryRepo.getByMarketer(
      id,
      method,
      status,
      startDate,
      finishDate
    );

    const total = await marketerWithdrawHistoryRepo.countList({
      id,
      method,
      status,
      startDate,
      finishDate,
    });
    if (marketerWDHis) {
      res.status(200).send({ status: "success", data: marketerWDHis, total });
    } else {
      res.status(400).send({ status: "failed" });
    }
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

    const withdrawHistory = await marketerWithdrawHistoryRepo.getAll(
      name,
      method,
      status,
      startDate,
      finishDate,
      offset,
      page
    );

    const total = await marketerWithdrawHistoryRepo.countList({
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
    const detail = await marketerWithdrawHistoryRepo.getById(id);
    if (detail) {
      res.status(200).send({ status: "success", data: detail });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(
      req.params.name,
      "marketer-withdraw-history"
    );
    if (!result || result === null) {
      throw new Error("Không tìm thấy hình ảnh của lịch sử rút.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
