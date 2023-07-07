import { Request, Response } from "express";
import * as companyTransactionLogRepo from "../repositories/companyTransactionLog.repo";

export const getByCompany = async (req: Request, res: Response) => {
  try {
    const company = req.body.user._id;
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const total = await companyTransactionLogRepo.totalByCompany(
      company,
      method,
      activity,
      startDate,
      finishDate
    );
    const data = await companyTransactionLogRepo.getTransactionLogByCompany(
      company,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );
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
  try {
    const name = req.body.name;
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const total = await companyTransactionLogRepo.totalAll(
      name,
      method,
      activity,
      startDate,
      finishDate
    );
    const data = await companyTransactionLogRepo.getAll(
      name,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );
    if (data) {
      res.status(200).send({ status: "success", data, total });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
