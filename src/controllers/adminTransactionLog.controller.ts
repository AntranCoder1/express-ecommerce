import { Request, Response } from "express";
import * as H2ExpressTransactionLogRepo from "../repositories/h2ExpressTransactionLog.repo";
import * as H2ExpressTokenRepo from "../repositories/h2ExpressToken.repo";
import * as collaboratorTransactionLogRepo from "../repositories/collaboratorTransactionLog.repo";
import * as marketerTransactionLogRepo from "../repositories/marketerTransactionLog.repo";

export const getList = async (req: Request, res: Response) => {
  try {
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);

    const data = await H2ExpressTransactionLogRepo.getTransactionLog(
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );
    const total = await H2ExpressTransactionLogRepo.totalHistory(
      method,
      startDate,
      finishDate,
      activity
    );

    const findToken = await H2ExpressTransactionLogRepo.findAll();

    let depositToken = 0;

    if (findToken.length > 0) {
      for (const i of findToken) {
        if (i.type === "deposit") {
          depositToken += i.token;
        }
      }
    }

    const findSurplus = await H2ExpressTokenRepo.findToken();

    if (data) {
      res.status(200).send({
        status: "success",
        data,
        total,
        depositToken,
        surplus: findSurplus[0].token,
      });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
