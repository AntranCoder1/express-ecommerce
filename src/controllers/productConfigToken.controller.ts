import { Request, Response } from "express";
import * as productConfigToken from "../repositories/productConfigToken.repo";

export const createProductToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.token;
    const createToken = await productConfigToken.create({ token });
    if (createToken) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getList = async (req: Request, res: Response) => {
  try {
    const getAllToken = await productConfigToken.findAll();

    if (getAllToken) {
      res.status(200).json({ amount: getAllToken[0].token });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
