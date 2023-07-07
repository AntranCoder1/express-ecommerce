import { Request, Response } from "express";
import {
  bankBranchGetList,
  bankBranchCreate,
  bankBranchUpdate,
  bankBranchDelete,
} from "../repositories/bankBranch.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const data = await bankBranchGetList(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      bank: req.body.bank,
      name: req.body.name,
    };
    const result = await bankBranchCreate(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
    };
    const result = await bankBranchUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await bankBranchDelete(req.params.id);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
