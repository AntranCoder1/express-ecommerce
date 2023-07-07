import { Request, Response } from "express";
import https from "https";

import momoRequest from "../modules/momo.module";
import * as maketerIncomeRepo from "../repositories/marketerIncome.repo";
import * as maketerDepositRepo from "../repositories//maketerDeposit.repo";
import * as maketerTransactionLogRepo from "../repositories/marketerTransactionLog.repo";

export const momoCreateRequest = async (req: Request, res: Response) => {
  try {
    const meketerId = req.body.user._id;
    const amount = req.body.amount;
    const redirectUrl = "https://192.170.1.136/marketer/marketer-deposit";
    const ipnUrl = "http://192.170.1.136/maketerDeposit/momo_ipn";
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

    // send the request and get the response
    const reqs = await https.request(options, (ress) => {
      ress.setEncoding("utf8");
      ress.on("data", async (body) => {
        console.log(body);
        const url = JSON.parse(body).payUrl;
        const customerIncome = await maketerIncomeRepo.getByMarketer(meketerId);

        const data = {
          meketerId,
          orderTransferId: momo.orderId,
          transferMethod: "momo",
          lastBalance: customerIncome.accountBalance,
          money: amount,
          type: "deposit",
        };

        const createDeposit = await maketerDepositRepo.createDeposit(data);

        // create transaction history maketer
        const dataHistory = {
          marketer: meketerId,
          type: "deposit",
          transferMethod: "momo",
          transactionCode: "",
          money: amount,
          description: "",
        };

        const createHistory =
          await maketerTransactionLogRepo.createMarketerTransactionLog(
            dataHistory
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
      console.log("vao day");

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
    const deposit = await maketerDepositRepo.getByOrderTransferId(body.orderId);
    if (deposit.status === -1) {
      const dataDeposit = {
        transactionCode: body.transId,
        status: body.resultCode,
        description: body.message,
      };
      const updateDeposit = await maketerDepositRepo.update(
        deposit._id,
        dataDeposit
      );
      if (body.resultCode === 0) {
        const maketerIncome = await maketerIncomeRepo.getByMarketer(
          deposit.maketer
        );
        const dataTransaction = {
          maketer: deposit.maketer,
          type: "deposit",
          idType: deposit._id,
          lastBalance: maketerIncome.accountBalance,
          money: body.amount,
          transferMethod: "momo",
          description: "Bạn đã nạp " + formatCurrency(body.amount),
          transactionCode: body.transId,
        };
        const createTransaction =
          await maketerTransactionLogRepo.createMarketerTransactionLog(
            dataTransaction
          );

        const dataIncome = {
          accountBalance: maketerIncome.accountBalance + body.amount,
          deposit: maketerIncome.deposit + body.amount,
        };
        const updateIncome = await maketerIncomeRepo.update(
          maketerIncome.marketer,
          dataIncome
        );
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
