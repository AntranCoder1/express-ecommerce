import { Request, Response } from "express";
import * as collaboratorTransactionLogRepo from "../repositories/collaboratorTransactionLog.repo";

export const getByCollaborator = async (req: Request, res: Response) => {
  try {
    const collaborator = req.body.user._id;
    const method = req.body.method;
    const activity = req.body.activity;
    const startDate = req.body.startDate;
    const finishDate = req.body.finishDate;
    const offset = parseInt(req.query.offset as string, 10);
    const page = parseInt(req.query.page as string, 10);
    const deposit = req.body.deposit;

    const data =
      await collaboratorTransactionLogRepo.getTransactionLogByCollaborator({
        collaborator,
        method,
        activity,
        startDate,
        finishDate,
        offset,
        page,
        deposit,
      });
    const total = await collaboratorTransactionLogRepo.totalByCollab({
      collaborator,
      method,
      activity,
      startDate,
      finishDate,
      deposit,
      isAdmin: false,
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
    const data = await collaboratorTransactionLogRepo.getAll(
      name,
      method,
      activity,
      startDate,
      finishDate,
      offset,
      page
    );
    const total = await collaboratorTransactionLogRepo.totalByCollab({
      name,
      method,
      activity,
      startDate,
      finishDate,
      isAdmin: true,
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
