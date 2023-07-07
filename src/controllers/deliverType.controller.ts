import { Request, Response } from "express";
import {
  dt_list,
  isKeywordAvailable,
  dt_create,
  dt_update,
  dt_delete,
  dt_seed,
} from "../repositories/deliverType.repo";
export const getList = async (req: Request, res: Response) => {
  try {
    const result = await dt_list();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
      keyword: req.body.keyword,
    };
    const availableKeyword = await isKeywordAvailable(body.keyword);
    if (availableKeyword === false) {
      throw new Error(
        "Từ khóa " +
          body.keyword +
          " đã được sử dụng bởi một loại hình thức vận chuyển khác."
      );
    }
    const result = await dt_create(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateById = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
      keyword: req.body.keyword,
    };
    const availableKeyword = await isKeywordAvailable(
      body.keyword,
      req.body._id
    );
    if (availableKeyword === false) {
      throw new Error(
        "Từ khóa " +
          body.keyword +
          " đã được sử dụng bởi một loại hình thức vận chuyển khác."
      );
    }
    const result = await dt_update(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    await dt_delete(req.params.id);
    res.status(200).json("Loại hình vận chuyển đã được xóa.");
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const seeding = async (req: Request, res: Response) => {
  try {
    await dt_seed();
    res.status(200).json("Các loại hình vận chuyển mặc định đã được tạo.");
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
