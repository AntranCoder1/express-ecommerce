import { Request, Response } from "express";
import {
  bc_list,
  bc_getById,
  bc_create,
  bc_update,
  bc_delete,
} from "./../repositories/blogCategory.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const result = await bc_list(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getById = async (req: Request, res: Response) => {
  try {
    const result = await bc_getById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      domain: req.body.domain,
      name: req.body.name,
      slug: req.body.slug,
    };
    const result = await bc_create(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateById = async (req: Request, res: Response) => {
  try {
    const body = {
      domain: req.body.domain,
      name: req.body.name,
      slug: req.body.slug,
    };
    const result = await bc_update(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    await bc_delete(req.params.id);
    res.status(200).json({ data: "Danh mục bài viết đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
