import { Request, Response } from "express";
import momoRequest from "../modules/momo.module";
import https from "https";
import * as customerIncomeRepo from "../repositories/customerIncome.repo";
import * as customerDepositRepo from "../repositories/CustomerDeposit.repo";
import * as customerTransactionLogRepo from "../repositories/customerTransactionLog.repo";

export const momoCreateRequest = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const amount = req.body.amount;

    const redirectUrl = "http://192.168.1.23:4200/tai-khoan";
    const ipnUrl = "http://192.168.1.23:4200/tai-khoan/momo_ipn";

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
        const customerIncome = await customerIncomeRepo.getByCustomer(
          customerId
        );

        let customerInfo;

        if (!customerIncome) {
          const dataIncome = {
            customer: customerId,
          };
          const createIncome = await customerIncomeRepo.createIncome(
            dataIncome
          );

          const getCustomerIncome = await customerIncomeRepo.getByCustomer(
            createIncome.customer
          );

          customerInfo = getCustomerIncome;
        } else {
          customerInfo = customerIncome;
        }

        const data = {
          customerId,
          orderTransferId: momo.orderId,
          transferMethod: "momo",
          lastBalance: customerInfo.accountBalance,
          money: amount,
          type: "deposit",
        };

        const createDeposit = await customerDepositRepo.createCustomerDeposit(
          data
        );

        // create transaction history customer
        const dataHistory = {
          customer: customerId,
          type: "deposit",
          transferMethod: "momo",
          transactionCode: "",
          money: amount,
          description: "",
        };

        const createHistory =
          await customerTransactionLogRepo.createTransactionLog(dataHistory);

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
    const deposit = await customerDepositRepo.getByOrderTransferId(
      body.orderId
    );
    if (deposit.status === -1) {
      const dataDeposit = {
        transactionCode: body.transId,
        status: body.resultCode,
        description: body.message,
      };
      const updateDeposit = await customerDepositRepo.update(
        deposit._id,
        dataDeposit
      );
      if (body.resultCode === 0) {
        const customerIncome = await customerIncomeRepo.getByCustomer(
          deposit.customer
        );
        const dataTransaction = {
          customer: deposit.customer,
          type: "deposit",
          idType: deposit._id,
          lastBalance: customerIncome.accountBalance,
          money: body.amount,
          transferMethod: "momo",
          description: "Bạn đã nạp " + formatCurrency(body.amount),
          transactionCode: body.transId,
        };
        const createTransaction =
          await customerTransactionLogRepo.createTransactionLog(
            dataTransaction
          );

        const dataIncome = {
          accountBalance: customerIncome.accountBalance + body.amount,
          deposit: customerIncome.deposit + body.amount,
        };
        const updateIncome = await customerIncomeRepo.update(
          customerIncome.customer,
          dataIncome
        );
      }
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
