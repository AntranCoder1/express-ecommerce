import { Request, Response } from "express";
import {
  orderStatusGetList,
  orderStatusCreate,
  orderStatusUpdate,
  orderStatusDelete,
  orderStatusSeed,
} from "../repositories/orderStatus.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const result = await orderStatusGetList();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      keyword: req.body.keyword,
      name: req.body.name,
      modifyOrder: req.body.modifyOrder,
    };
    const result = await orderStatusCreate(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      keyword: req.body.keyword,
      name: req.body.name,
      modifyOrder: req.body.modifyOrder,
    };
    const result = await orderStatusUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await orderStatusDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const seed = async (req: Request, res: Response) => {
  try {
    const result = await orderStatusSeed();
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
