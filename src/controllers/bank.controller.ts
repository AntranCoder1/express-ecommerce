import { Request, Response } from "express";
import {
  bankCreate,
  bankUpdate,
  bankDelete,
  bankGetList,
  bankSeed,
} from "../repositories/bank.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const data = await bankGetList();
    res.status(200).json({ data });
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
    };
    const result = await bankCreate(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
    };
    const result = await bankUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await bankDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};
export const seed = async (req: Request, res: Response) => {
  try {
    await bankSeed();
    res
      .status(201)
      .json({ data: "Dữ liệu ngân hàng và chi nhánh ngân hàng đã được tạo." });
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
};
