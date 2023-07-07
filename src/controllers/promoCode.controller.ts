import { Request, Response } from "express";

import * as promoCodeRepo from "../repositories/promoCode.repo";
import * as domainRepo from "../repositories/domain.repo";
import getHostname from "../modules/hostname.module";
export const createPromoCode = async (req: Request, res: Response) => {
  try {
    const domain = req.body.domain;
    const name = req.body.name;
    const productType = req.body.productType;
    const endAt = req.body.endAt;
    const startAt = req.body.startAt;
    const discountAmount = req.body.discountAmount;
    const discountType = req.body.discountType;
    const description = req.body.description;
    const productList = req.body.productList;
    const productSelect = req.body.productSelect;
    const data = {
      domain,
      name,
      productType,
      endAt,
      startAt,
      discountAmount,
      discountType,
      description,
      productList,
      productSelect,
    };
    const createPromo = await promoCodeRepo.pc_create(data);
    if (createPromo) {
      res.status(200).send({ status: "success" });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const checkPromoCode = async (req: Request, res: Response) => {
  try {
    const hostname = req.headers.origin as string;
    const name = req.body.code;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }
    const check = await promoCodeRepo.checkCode(name, getDomain._id);
    if (check.length > 0) {
      res.status(200).json({ status: "success", data: check });
    } else {
      res.status(200).json({ status: "failed", message: "Mã không hợp lệ" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
