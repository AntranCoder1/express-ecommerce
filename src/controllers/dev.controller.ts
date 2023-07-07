import { Request, Response } from "express";
import * as devRepo from "../repositories/dev.repo";
import { sendmail_test } from "../repositories/mailMan.repo";
export const createSecretKey = async (req: Request, res: Response) => {
  try {
    const data = devRepo.createRandomSecretKey();
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const sendMail = async (req: Request, res: Response) => {
  try {
    sendmail_test();
    res.status(200).json({ data: "Email đã được gửi đi." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
