import { Request, Response } from "express";
import {
  isAvailableVariant,
  productVariantCreate,
  productVariantUpdate,
  productVariantDelete,
  productVariantGetListByProduct,
  productVariantGetById,
  productVariantDeleteMany,
} from "../repositories/productVariant.repo";

export const getListByProduct = async (req: Request, res: Response) => {
  try {
    const result = await productVariantGetListByProduct(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getById = async (req: Request, res: Response) => {
  try {
    const result = await productVariantGetById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.attributes) {
      throw new Error(
        "Không thể tạo nhóm phân loại " +
          req.body.name +
          " vì không kèm theo bất kỳ thuộc tính nào."
      );
    }
    const body = {
      product: req.body.product,
      name: req.body.name,
      attributes: req.body.attributes,
    };
    const available = await isAvailableVariant(body.product, body.name);
    if (available === false) {
      throw new Error("Nhóm phân loại đã tồn tại.");
    }
    const newVariantId = await productVariantCreate(body);

    res.status(201).json({ data: newVariantId });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      name: req.body.name,
      attributes: req.body.attributes,
    };
    const available = await isAvailableVariant(
      req.body.product,
      body.name,
      req.body._id
    );
    if (available === false) {
      throw new Error("Nhóm phân loại đã tồn tại.");
    }
    const result = await productVariantUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await productVariantDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteMany = async (req: Request, res: Response) => {
  try {
    await productVariantDeleteMany(req.body.variants);
    res
      .status(200)
      .json({ data: "Các nhóm phân loại của sản phẩm đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
