import { Request, Response } from "express";
import {
  momoBusinessGetByUser,
  momoBusinessCreate,
  momoBusinessUpdate,
  momoBusinessDelete,
} from "../repositories/momoBusiness.repo";
import * as dotenv from "dotenv";
dotenv.config();
const momoApiUrl = process.env.MOMO_API_URL;
import crypto from "crypto";
import axios from "axios";

export const getByUser = async (req: Request, res: Response) => {
  try {
    const user = {
      _id: req.body._id,
      type: req.body.type,
    };
    const data = await momoBusinessGetByUser(user);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      userType: req.body.userType,
      userId: req.body.userId,
      partnerCode: req.body.partnerCode,
      accessKey: req.body.accessKey,
      secretKey: req.body.secretKey,
      apiEndPoint: process.env.MOMO_API_ENDPOINT as string,
    };
    const result = await momoBusinessCreate(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const body = {
      partnerCode: req.body.partnerCode,
      accessKey: req.body.accessKey,
      secretKey: req.body.secretKey,
      apiEndPoint: process.env.MOMO_API_ENDPOINT as string,
    };
    const result = await momoBusinessUpdate(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await momoBusinessDelete(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const testPayment = async (req: Request, res: Response) => {
  const partnerCode = req.body.partnerCode;
  const requestId = partnerCode + new Date().getTime();
  const amount = req.body.amount;
  const orderId = partnerCode + new Date().getTime();
  const orderInfo = "Thử gửi request cho MOMO";
  const redirectUrl = "http://localhost:4200";
  const ipnUrl = "https://momo.vn";
  const requestType = "captureWallet";
  const extraData = "";
  const rawSignature =
    "accessKey=$" +
    req.body.accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  const signature = crypto.createHmac("sha256", rawSignature);

  const requestBody = {
    partnerCode,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
    lang: "vi",
    signature,
  };
  axios
    .post(momoApiUrl + "/v2/gateway/api/create", requestBody)
    .then((response: any) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(400).json({ message: (err as Error).message });
    });
};
