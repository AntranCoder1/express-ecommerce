import { NextFunction } from "connect";
import { Request, Response } from "express";

const collaborator = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user) {
    if (req.body.user.isCollaborator) {
      next();
    }
  } else {
    res.status(401);
    res.send("Unauthorized");
  }
};

export default collaborator;
