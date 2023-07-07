import { NextFunction } from "connect";
import { Request, Response } from "express";

const marketer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user) {
    if (req.body.user.isMarketer) {
      next();
    }
  } else {
    res.status(401);
    res.send("Unauthorized");
  }
};

export default marketer;
