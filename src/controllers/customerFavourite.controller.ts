import { Request, Response } from "express";
import {
  cf_list,
  cf_update,
  isFavourite,
} from "./../repositories/customerFavourite.repo";
export const list = async (req: Request, res: Response) => {
  try {
    const result = await cf_list(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const result = await cf_update(req.body.product, req.body.customer);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const isLiked = async (req: Request, res: Response) => {
  try {
    const body = {
      customer: req.body.customer,
      product: req.body.product,
    };
    const result = await isFavourite(body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
