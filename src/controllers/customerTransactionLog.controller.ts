import { Request, Response } from "express";
import * as customerTransactionRepo from "../repositories/customerTransactionLog.repo";
import * as customerTokenRepo from "../repositories/customerToken.repo";

export const getByCustomer = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const tradingCode = req.body.tradingCode;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);

    const data = await customerTransactionRepo.getTransactionLogByCustomer(
      customerId,
      method,
      activity,
      startDate,
      finishDate,
      tradingCode,
      offset,
      page
    );
    const total = await customerTransactionRepo.totalByCustomer({
      customerId,
      method,
      startDate,
      finishDate,
      activity,
      tradingCode,
    });

    if (data) {
      res.status(200).send({
        status: "success",
        data,
        total,
      });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  const name = req.body.name;
  const method = req.body.method;
  const activity = req.body.activity;
  const startDate = req.body.startDate;
  const finishDate = req.body.finishDate;
  const offset = parseInt(req.query.offset as string, 10);
  const page = parseInt(req.query.page as string, 10);
  try {
    const data = await customerTransactionRepo.getAll(
      name,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );

    const total = await customerTransactionRepo.totalByCustomer({
      name,
      method,
      activity,
      startDate,
      finishDate,
    });

    if (data) {
      res.status(200).send({ status: "success", data, total });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
