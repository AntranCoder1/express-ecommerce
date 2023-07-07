import { Request, Response } from "express";
import {
  productVariantSampleGetListByCompany,
  productVariantSampleCreate,
  productVariantSampleUpdate,
  productVariantSampleDelete,
} from "./../repositories/productVariantSample";
export const getListByCompany = async (req: Request, res: Response) => {
  const company = req.body.user._id;
  try {
    const result = await productVariantSampleGetListByCompany(company);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      company: req.body.user._id,
      name: req.body.name,
      attributes: req.body.attributes,
    };
    const result = await productVariantSampleCreate(body);
    res.status(201).json({ data: result });
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
    const result = await productVariantSampleUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await productVariantSampleDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
