import { Request, Response } from "express";
import {
  receiverGetList,
  receiverCreate,
  receiverUpdate,
  receiverDelete,
} from "../repositories/receiver.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const result = await receiverGetList(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      customer: req.body.customer,
      nickname: req.body.nickname,
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    };
    const result = await receiverCreate(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      fullName: req.body.fullName,
      nickname: req.body.nickname,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    };
    const result = await receiverUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await receiverDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
