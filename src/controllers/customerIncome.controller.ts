import { Request, Response } from "express";
import * as customerIncomeRepo from "../repositories/customerIncome.repo";

export const create = async (req: Request, res: Response) => {
  try {
    const customerId = req.body.user._id;

    const data = {
      customer: customerId,
    };
    const createIncome = await customerIncomeRepo.createIncome(data);
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
