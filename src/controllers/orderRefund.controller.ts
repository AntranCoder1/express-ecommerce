import {
  orderRefundGetById,
  orderRefundCreate,
  orderRefundUpdate,
} from "./../repositories/orderRefund.repo";
import { Request, Response } from "express";
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      order: req.body.order,
      amount: req.body.amount,
      history: [
        {
          date: new Date(),
          amount: req.body.amount,
        },
      ],
    };
    const result = await orderRefundCreate(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const refund = await orderRefundGetById(req.body.order);
    if (refund) {
      const history = refund.history;
      const body = {
        amount: req.body.amount,
        history: history.push({
          date: new Date(),
          amount: req.body.amount,
        }),
      };
      const result = await orderRefundUpdate(req.body.order, body);
      res.status(200).json({ data: result });
    } else {
      throw new Error("Không tìm thấy thông tin hoàn tiền của đơn hàng.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
