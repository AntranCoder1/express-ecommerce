import { Request, Response } from "express";
import {
  productTechnicalSampleCreate,
  productTechnicalSampleUpdate,
  productTechnicalSampleGetListByCompay,
  productTechnicalSampleDelete,
} from "./../repositories/productTechnicalSample.repo";
export const getList = async (req: Request, res: Response) => {
  const companyId = req.body.user._id;
  try {
    const data = await productTechnicalSampleGetListByCompay(companyId);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      company: req.body.user._id,
      name: req.body.name,
      technicals: req.body.technicals,
    };
    const data = await productTechnicalSampleCreate(body);
    res.status(201).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const id = req.body._id;
    const body = {
      company: req.body.user._id,
      name: req.body.name,
      technicals: req.body.technicals,
    };
    const data = await productTechnicalSampleUpdate(id, body);
    res.status(201).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await productTechnicalSampleDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
