import { NextFunction } from "connect";
import { Request, Response } from "express";

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user) {
    if (req.body.user.isAdmin === true) {
      next();
    }
  } else {
    res.status(401);
    res.send("Unauthorized");
  }
};

export default admin;
