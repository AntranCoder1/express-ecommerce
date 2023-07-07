import { Request, Response } from "express";
import {
  creditCardGetByUser,
  creditCardCreate,
  creditCardUpdate,
  creditCardDelete,
  creditCardIsValid,
} from "../repositories/creditCard.repo";
export const getByUser = async (req: Request, res: Response) => {
  try {
    const user = {
      type: req.body.type,
      _id: req.body._id,
    };
    const data = await creditCardGetByUser(user);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      type: req.body.type,
      holder: req.body.holder,
      expMonth: req.body.expMonth,
      expYear: req.body.expYear,
      securityNumber: req.body.securityNumber,
      number: req.body.number,
      lastFour: req.body.number.slice(req.body.number.length - 4),
      userType: req.body.userType,
      userId: req.body.userId,
    };
    const valid = await creditCardIsValid(body);
    if (valid === true) {
      const result = await creditCardCreate(body);
      res.status(201).json({ data: result });
    } else {
      throw new Error(
        "Thẻ không hợp lệ. Vui lòng kiểm tra lại thông tin thẻ hoặc liên hệ hỗ trợ."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      type: req.body.type,
      holder: req.body.holder,
      expMonth: req.body.expMonth,
      expYear: req.body.expYear,
      securityNumber: req.body.securityNumber,
      number: req.body.number,
      lastFour: req.body.number.slice(req.body.number.length - 4),
    };
    const valid = await creditCardIsValid(body);
    if (valid === true) {
      const result = await creditCardUpdate(req.body._id, body);
      res.status(201).json({ data: result });
    } else {
      throw new Error(
        "Thẻ không hợp lệ. Vui lòng kiểm tra lại thông tin thẻ hoặc liên hệ hỗ trợ."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await creditCardDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
