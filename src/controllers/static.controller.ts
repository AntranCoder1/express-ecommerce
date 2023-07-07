import { Request, Response } from "express";
import { statis_getImage } from "../repositories/static.repo";
export const getImage = async (req: Request, res: Response) => {
  try {
    const result: any = statis_getImage(req.params.name);
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
