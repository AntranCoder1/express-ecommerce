import { Request, Response } from "express";
import https from "https";

import momoRequest from "../modules/momo.module";
import * as companyDepositRepo from "../repositories/companyDeposit.repo";
import * as companyTransactionLogRepo from "../repositories/companyTransactionLog.repo";
import * as companyIncomeRepo from "../repositories/companyIncome.repo";
export const getByCompany = async (req: Request, res: Response) => {
  try {
    const id = req.body.user._id;
    const method = req.body.method;
    const status = req.body.status;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const total = await companyDepositRepo.totalByCompany(
      id,
      method,
      status,
      startDate,
      finishDate
    );
    const companyDeposit = await companyDepositRepo.getByCompany(
      id,
      method,
      status,
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
    const total = await companyDepositRepo.totalAll(
      name,
      method,
      status,
      startDate,
      finishDate
    );
    const deposit = await companyDepositRepo.getAll(
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

export const momoCreateRequest = async (req: Request, res: Response) => {
  try {
    const company = req.body.user._id;
    const amount = req.body.amount;
    const redirectUrl = "https://app.chocangay.com/company/company-deposit";
    const ipnUrl = "https://api.chocangay.com/companyDeposit/momo_ipn";
    const momo: any = await momoRequest(amount, redirectUrl, ipnUrl);
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(momo.str),
      },
    };
    // Send the request and get the response
    const reqs = await https.request(options, (ress) => {
      ress.setEncoding("utf8");
      ress.on("data", async (body) => {
        console.log(body);
        const url = JSON.parse(body).payUrl;
        const companyIncome = await companyIncomeRepo.getByCompany(company);
        const data = {
          company,
          orderTransferId: momo.orderId,
          transferMethod: "momo",
          lastBalance: companyIncome.accountBalance,
          money: amount,
          type: "deposit",
        };
        const createDeposit = await companyDepositRepo.createCompanyDeposit(
          data
        );

        if (createDeposit) {
          res.status(200).send({ status: "success", data: url });
        }
      });
      ress.on("end", () => {
        console.log("No more data in response.");
      });
    });

    req.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    reqs.write(momo.str);
    reqs.end();
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

export const momoIPNRequest = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const deposit = await companyDepositRepo.getByOrderTransferId(body.orderId);
    if (deposit.status === -1) {
      const dataDeposit = {
        transactionCode: body.transId,
        status: body.resultCode,
        description: body.message,
      };
      const updateDeposit = await companyDepositRepo.update(
        deposit._id,
        dataDeposit
      );
      if (body.resultCode === 0) {
        const companyIncome = await companyIncomeRepo.getByCompany(
          deposit.company
        );
        const dataTransaction = {
          company: deposit.company,
          type: "deposit",
          idType: deposit._id,
          lastBalance: companyIncome.accountBalance,
          money: body.amount,
          transferMethod: "momo",
          description: "Bạn đã nạp " + formatCurrency(body.amount),
          transactionCode: body.transId,
        };
        const createTransaction =
          await companyTransactionLogRepo.createCompanyTransactionLog(
            dataTransaction
          );

        const dataIncome = {
          accountBalance: companyIncome.accountBalance + body.amount,
          deposit: companyIncome.deposit + body.amount,
        };
        const updateIncome = await companyIncomeRepo.update(
          companyIncome.company,
          dataIncome
        );
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
