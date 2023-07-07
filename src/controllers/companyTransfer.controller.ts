import { Request, Response } from "express";
import * as companyTransferRepo from "../repositories/companyTransfer.repo";
import * as companyIncomeRepo from "../repositories/companyIncome.repo";
import * as companyTransactionLogRepo from "../repositories/companyTransactionLog.repo";
import * as orderRepo from "../repositories/order.repo";
import * as CompanyProcessingFeeRepo from "../repositories/companyProcessingFee.repo";
import * as CompanyProcessingFeeTransaction from "../repositories/companyProcessingFeeTransaction.repo";
import * as CompanyTokenRepo from "../repositories/companyToken.repo";
import * as companyTokenTransactionRepo from "../repositories/companyTokenTransaction.repo";
export const getByCompany = async (req: Request, res: Response) => {
  try {
    const id = req.body.user._id;
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const total = await companyTransferRepo.totalByCompany(
      id,
      method,
      activity,
      startDate,
      finishDate
    );
    const companyDeposit = await companyTransferRepo.getByCompany(
      id,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );
    if (companyDeposit) {
      res.status(200).send({ status: "success", data: companyDeposit, total });
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
    const total = await companyTransferRepo.totalAll(
      name,
      method,
      status,
      startDate,
      finishDate
    );
    const deposit = await companyTransferRepo.getAll(
      name,
      method,
      status,
      startDate,
      finishDate,
      offset,
      page
    );
    if (deposit) {
      res.status(200).send({ status: "success", data: deposit, total });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

const formatCurrency = (money) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money);
};

export const createRequest = async (req: Request, res: Response) => {
  try {
    const company = req.body.user._id;
    const amount = req.body.amount;
    const orderId = req.body.orderId;
    const token = req.body.token;
    const companyIncome = await companyIncomeRepo.getByCompany(company);
    if (companyIncome.accountBalance < amount) {
      throw new Error(
        "Số dư không đủ. Vui lòng nạp thêm để thực hiện giao dịch"
      );
    }
    const transferData = {
      company,
      type: "orderFee",
      idType: orderId,
      transferMethod: "system",
      lastBalance: companyIncome.accountBalance,
      money: "-" + amount,
      status: 1,
      description: "Giao dịch thành công",
    };
    const createTransfer = await companyTransferRepo.createCompanyTransfer(
      transferData
    );
    const transactionData = {
      company,
      type: "transfer",
      idType: createTransfer._id,
      lastBalance: companyIncome.accountBalance,
      money: "-" + amount,
      transferMethod: "system",
      description:
        "Bạn đã trả phí " + formatCurrency(amount) + " cho đơn hàng " + orderId,
      transactionCode: "",
    };
    const createTransaction =
      await companyTransactionLogRepo.createCompanyTransactionLog(
        transactionData
      );
    const orderData = {
      isCompanyBuy: 1,
    };
    const orderU = await orderRepo.orderUpdate(orderId, orderData);

    // processing fee
    const companyToken = await CompanyTokenRepo.getTokenWithCompany(company);

    if (companyToken.token < token) {
      throw new Error(
        "Số dư không đủ. Vui lòng nạp thêm token để thực hiện giao dịch"
      );
    }
    const lastBalanceToken = companyToken.token - token;

    const processingFeeData = {
      company,
      type: "processingFee",
      lastBalanceToken,
      token,
      description: "Giao dịch thành công",
    };
    const createProcessingFee =
      await CompanyProcessingFeeRepo.createProcessingFee(processingFeeData);

    // create transaction token
    const processingFeeTransactiondata = {
      company,
      companyProcessingFee: createProcessingFee._id,
      type: "processingFee",
      token: "-" + token,
      lastBalanceToken,
      description:
        "Bạn đã trả " +
        token +
        " token cho đơn hàng " +
        orderId +
        ". Token còn lại của bạn là: " +
        lastBalanceToken,
    };
    const createProcessingFeeTransaction =
      await CompanyProcessingFeeTransaction.createTransaction(
        processingFeeTransactiondata
      );

    // create transaction history token company
    const dataRecord = {
      company,
      type: "processingFee",
      token,
      lastBalanceToken,
      description:
        " Bạn đã sử dụng " +
        token +
        " token để trả phí cho đơn hàng" +
        orderId +
        " số token còn lại là " +
        lastBalanceToken,
    };
    const createRecord = await companyTokenTransactionRepo.createTransaction(
      dataRecord
    );

    // update company token
    const updateCompanToken = await CompanyTokenRepo.updateCompanyToken(
      company,
      { token: lastBalanceToken }
    );

    // create company transaction
    const companyTransactionLog = {
      company,
      type: "transfer",
      idType: createProcessingFeeTransaction._id,
      lastBalance: lastBalanceToken,
      transferMethod: "token",
      description: "Bạn đã trả phí " + token + " token cho đơn hàng " + orderId,
      transactionCode: "",
      token,
    };
    const createTransactionLog =
      await companyTransactionLogRepo.createCompanyTransactionLog(
        companyTransactionLog
      );

    if (createTransaction && orderU && createProcessingFeeTransaction) {
      const incomeData = {
        accountBalance: companyIncome.accountBalance - amount,
        transfer: companyIncome.transfer + amount,
      };
      const companyIncomeUpdate = await companyIncomeRepo.update(
        company,
        incomeData
      );
      if (companyIncomeUpdate.modifiedCount) {
        // markerter award
        // const findmarkerter = await orderRepo.orderGetById(orderId);
        // let markerter;
        // let companies;
        // for (const i of findmarkerter) {
        //   markerter = i.marketer;
        //   companies = i.company;
        // }
        // const findMarkerterToken = await markerterTokenRepo.findByMarkerterId(
        //   markerter._id
        // );
        // if (!findMarkerterToken) {
        //   const markerterTokenData = {
        //     company,
        //     markerter: markerter._id,
        //     type: "award",
        //     token,
        //     description: token + " token đã được thêm vào tài khoản của ban",
        //   };
        //   const createMarkerterToken = await markerterTokenRepo.createToken(
        //     markerterTokenData
        //   );
        //   const markerterTokenTransactionData = {
        //     company,
        //     markerterToken: createMarkerterToken._id,
        //     type: "transfer",
        //     token: "+" + token,
        //     lastBalanceToken: token,
        //     description:
        //       "bạn đã được chuyển " + token + " token từ " + companies.name,
        //   };
        //   const createMarkerterTokenTransactionCreate =
        //     await markerterTokenTransactionRepo.createTransaction(
        //       markerterTokenTransactionData
        //     );
        //   // update company token
        //   const companyTokenCreate = await CompanyTokenRepo.getTokenWithCompany(
        //     company
        //   );
        //   const updateCompanTokenCreate =
        //     await CompanyTokenRepo.updateCompanyToken(company, {
        //       token: companyTokenCreate.token - token,
        //     });
        // } else {
        //   const updateMarkerterToken = await markerterTokenRepo.updateToken(
        //     markerter._id,
        //     company,
        //     {
        //       token: findMarkerterToken.token + token,
        //       description: token + " token đã được thêm vào tài khoản của ban",
        //     }
        //   );
        //   const markerterTokenTransactionData = {
        //     company,
        //     markerterToken: findMarkerterToken._id,
        //     type: "transfer",
        //     token: "+" + token,
        //     lastBalanceToken: findMarkerterToken.token + token,
        //     description:
        //       "bạn đã được chuyển " + token + " token từ " + companies.name,
        //   };
        //   const createMarkerterTokenTransactionUpdate =
        //     await markerterTokenTransactionRepo.createTransaction(
        //       markerterTokenTransactionData
        //     );
        //   // update company token
        //   const companyTokenUpdate = await CompanyTokenRepo.getTokenWithCompany(
        //     company
        //   );
        //   const updateCompanTokenUpdate =
        //     await CompanyTokenRepo.updateCompanyToken(company, {
        //       token: companyTokenUpdate.token - token,
        //     });
        // }

        res.status(200).send({ status: "success" });
      } else {
        res.status(400).send({ status: "failed" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
