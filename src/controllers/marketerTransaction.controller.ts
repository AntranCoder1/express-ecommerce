import { Request, Response } from "express";
import * as marketerTransactionLogRepo from "../repositories/marketerTransactionLog.repo";

export const getByMarketer = async (req: Request, res: Response) => {
  try {
    const marketer = req.body.user._id;
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const deposit = req.body.deposit;
    const data = await marketerTransactionLogRepo.getTransactionLogByMarketer({
      marketer,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page,
      deposit,
    });
    const total = await marketerTransactionLogRepo.totalByMarketer({
      marketer,
      method,
      startDate,
      finishDate,
      activity,
      deposit,
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

export const getAll = async (req: Request, res: Response) => {
  const name = req.body.name;
  const method = req.body.method;
  const activity = req.body.activity;
  const startDate = req.body.startDate;
  const finishDate = req.body.finishDate;
  const offset = parseInt(req.query.offset as string, 10);
  const page = parseInt(req.query.page as string, 10);
  try {
    const data = await marketerTransactionLogRepo.getAll(
      name,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );
    const total = await marketerTransactionLogRepo.totalByMarketer({
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
