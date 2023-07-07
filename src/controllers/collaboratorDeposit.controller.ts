import { Request, Response } from "express";
import https from "https";

import momoRequest from "../modules/momo.module";
import * as collaboratorDepositRepo from "../repositories/collaboratorDeposit.repo";
import * as collaboratorIncomeRepo from "../repositories/collaboratorIncome.repo";
import * as collaboratorTransactionRepo from "../repositories/collaboratorTransactionLog.repo";

export const momoCreateRequest = async (req: Request, res: Response) => {
  try {
    const collaboratorId = req.body.user._id;
    const amount = req.body.amount;
    const redirectUrl =
      "https://192.170.1.136/collaborator/collaborator-deposit";
    const ipnUrl = "https://192.170.1.136/collaboratorDeposit/momo_ipn";
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
        const companyIncome = await collaboratorIncomeRepo.getByCollaborator(
          collaboratorId
        );
        const data = {
          collaborator: collaboratorId,
          orderTransferId: momo.orderId,
          transferMethod: "momo",
          lastBalance: companyIncome.accountBalance,
          money: amount,
          type: "deposit",
        };
        const createDeposit = await collaboratorDepositRepo.createDeposit(data);

        if (createDeposit) {
          res.status(200).send({ status: "success", data: url });
        }

        // create transaction history collaborator
        const dataHistory = {
          collaborator: collaboratorId,
          type: "deposit",
          transferMethod: "momo",
          transactionCode: "",
          money: amount,
          description: "",
        };

        const createHistory =
          await collaboratorTransactionRepo.createCollaboratorTransactionLog(
            dataHistory
          );
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
    const deposit = await collaboratorDepositRepo.getByOrderTransferId(
      body.orderId
    );
    if (deposit.status === -1) {
      const dataDeposit = {
        transactionCode: body.transId,
        status: body.resultCode,
        description: body.message,
      };
      const updateDeposit = await collaboratorDepositRepo.update(
        deposit._id,
        dataDeposit
      );
      if (body.resultCode === 0) {
        const collaboratorIncome =
          await collaboratorIncomeRepo.getByCollaborator(deposit.collaborator);

        const dataTransaction = {
          collaborator: deposit.collaborator,
          type: "deposit",
          idType: deposit._id,
          lastBalance: collaboratorIncome.accountBalance,
          money: body.amount,
          transferMethod: "momo",
          description: "Bạn đã nạp " + formatCurrency(body.amount),
          transactionCode: body.transId,
        };
        const createTransaction =
          await collaboratorTransactionRepo.createCollaboratorTransactionLog(
            dataTransaction
          );

        const dataIncome = {
          accountBalance: collaboratorIncome.accountBalance + body.amount,
          deposit: collaboratorIncome.deposit + body.amount,
        };
        const updateIncome = await collaboratorIncomeRepo.update(
          collaboratorIncome.collaborator,
          dataIncome
        );
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
