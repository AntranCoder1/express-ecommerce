import { Request, Response } from "express";

export const checkPermission = async (req: Request, res: Response) => {
  try {
    if (req.body.user.isAdmin) {
      res.status(200).json({ status: 200, message: 0 });
    } else if (req.body.user.isCompany) {
      res.status(200).json({ status: 200, message: 1 });
    } else if (req.body.user.isMarketer) {
      res.status(200).json({ status: 200, message: 2 });
    } else {
      res.status(200).json({ status: 200, message: 3 });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
