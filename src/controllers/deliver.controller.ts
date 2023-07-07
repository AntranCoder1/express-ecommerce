import { Request, Response } from "express";
import {
  d_list,
  d_create,
  d_update,
  d_delete,
  d_seed,
} from "../repositories/deliver.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const result = await d_list();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
      attributes: req.body.attributes,
      notes: req.body.notes,
    };
    const result = await d_create(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateById = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
      attributes: req.body.attributes,
      notes: req.body.notes,
    };
    const result = await d_update(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    await d_delete(req.params.id);
    res.status(200).json("Đơn vị vận chuyển đã được xóa.");
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const seeding = async (req: Request, res: Response) => {
  try {
    await d_seed();
    res.status(200).json("Các đơn vị vận chuyển mặc định đã được tạo.");
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
