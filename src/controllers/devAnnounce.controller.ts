import { Request, Response } from "express";
import {
  devAnnounceCreate,
  devAnnounceUpdate,
  devAnnounceDelete,
  devAnnounceGetList,
} from "../repositories/devAnnounce.repo";
//#region Get
export const getList = async (req: Request, res: Response) => {
  try {
    const result = await devAnnounceGetList();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Modifies
export const create = async (req: Request, res: Response) => {
  try {
    const createBody = {
      title: req.body.title,
      content: req.body.content,
    };
    const result = await devAnnounceCreate(createBody);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const updateBody = {
      title: req.body.title,
      content: req.body.content,
    };
    const result = await devAnnounceUpdate(req.body._id, updateBody);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Delete
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await devAnnounceDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
