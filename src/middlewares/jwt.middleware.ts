import { NextFunction } from "connect";
import { Request, Response } from "express";
import * as authenticationUtil from "../utils/authentication.util";

const jwt = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.toString();
    token = token.replace(/^Bearer\s+/, "");
    try {
      const user = authenticationUtil.verify(token);
      if (user) {
        req.body.user = user;
        next();
        return;
      }
    } catch (exception) {
      res.status(401);
      res.send("Unauthorized");
    }
  }
  res.status(401);
  res.send("Unauthorized");
};

export default jwt;
